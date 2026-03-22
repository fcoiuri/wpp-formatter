export function parseWhatsApp(text: string): string {
  if (!text) return '';

  const codeBlocks: string[] = [];
  const processed = text.replace(/```([\s\S]*?)```/g, (_, code: string) => {
    codeBlocks.push(code.trim());
    return `\x00CODEBLOCK${codeBlocks.length - 1}\x00`;
  });

  const lines = processed.split('\n');
  const resultLines: string[] = [];
  let inBullet = false;
  let inNumbered = false;

  const closeList = (): void => {
    if (inBullet) {
      resultLines.push('</ul>');
      inBullet = false;
    }
    if (inNumbered) {
      resultLines.push('</ol>');
      inNumbered = false;
    }
  };

  const applyInline = (str: string): string =>
    str
      .replace(/\*([^*\n]+)\*/g, '<strong>$1</strong>')
      .replace(/_([^_\n]+)_/g, '<em>$1</em>')
      .replace(/~([^~\n]+)~/g, '<s>$1</s>')
      .replace(/`([^`\n]+)`/g, '<code>$1</code>');

  for (const line of lines) {
    if (/\x00CODEBLOCK\d+\x00/.test(line)) {
      closeList();
      const html = line.replace(/\x00CODEBLOCK(\d+)\x00/g, (_, i: string) => {
        const escaped = (codeBlocks[parseInt(i)] ?? '')
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
        return `<pre><code>${escaped}</code></pre>`;
      });
      resultLines.push(html);
      continue;
    }

    if (line.startsWith('> ')) {
      closeList();
      resultLines.push(
        `<blockquote>${applyInline(line.slice(2))}</blockquote>`,
      );
      continue;
    }

    if (/^[*-] /.test(line)) {
      if (inNumbered) {
        resultLines.push('</ol>');
        inNumbered = false;
      }
      if (!inBullet) {
        resultLines.push('<ul>');
        inBullet = true;
      }
      resultLines.push(`<li>${applyInline(line.slice(2))}</li>`);
      continue;
    }

    if (/^\d+\. /.test(line)) {
      if (inBullet) {
        resultLines.push('</ul>');
        inBullet = false;
      }
      if (!inNumbered) {
        resultLines.push('<ol>');
        inNumbered = true;
      }
      resultLines.push(`<li>${applyInline(line.replace(/^\d+\. /, ''))}</li>`);
      continue;
    }

    closeList();
    resultLines.push(line === '' ? '<br />' : `<p>${applyInline(line)}</p>`);
  }

  closeList();
  return resultLines.join('');
}
