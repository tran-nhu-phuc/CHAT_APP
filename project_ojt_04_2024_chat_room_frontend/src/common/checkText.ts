const hasTextContent = (htmlString: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  const textContent = doc.body.textContent || '';
  if (textContent.trim().length === 0) {
    return false;
  }
  const cleanedHtml = doc.body.innerHTML.replace(/<br\s*\/?>/gi, '').trim();
  return cleanedHtml.length > 0;
};

export default hasTextContent;
