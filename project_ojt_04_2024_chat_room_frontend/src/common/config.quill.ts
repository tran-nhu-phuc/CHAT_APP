import 'quill-mention/dist/quill.mention.min.css';
import 'quill-mention';
import Quill from 'quill';

const MentionBlot: any = Quill.import('blots/mention');

class StyledMentionBlot extends MentionBlot {
  static render(data: any) {
    const element = document.createElement('span');
    element.innerText = data.value;
    element.className = 'span';
    return element;
  }
}
StyledMentionBlot.blotName = 'styled-mention';

Quill.register(StyledMentionBlot);
