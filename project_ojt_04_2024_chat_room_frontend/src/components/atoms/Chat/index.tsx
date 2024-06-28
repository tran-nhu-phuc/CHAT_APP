/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { memo, useEffect, useRef, useState } from 'react';
import 'quill/dist/quill.core.css';
import 'quill-mention/dist/quill.mention.css';
import Quill from 'quill';
import '../../../common/config.quill';
import './index.scss';
import { UserInRoomResponse } from '../../../apis/user-in-room/responses/user-in-room.response';
import { ChatInterface } from '../../../utilities/interface-chat.util';
import hasTextContent from '../../../common/checkText';
interface Props {
  handelMessage: any;
  message: string;
  listUserByRoom: UserInRoomResponse[];
  handelTagNameAll: Function;
  handleSendMessage: Function;
}
const ChatMessage: React.FC<Props> = (props: Props) => {
  const editorRef = useRef<Quill | null>(null);
  const [eventOpenModelTagName, setEventOpenModelTagName] = useState<boolean>(false);

  const handleKeyPress = (event: any) => {
    if (event.key === 'Enter' && hasTextContent(props.message)) {
      props.handleSendMessage();
    }
  };

  const emptyFunction = () => {};
  useEffect(() => {
    const atValues: ChatInterface[] = [
      {
        userId: 'All',
        avatar: 'https://icons.iconarchive.com/icons/custom-icon-design/silky-line-user/512/users-icon.png',
        value: 'All',
      },
    ];
    props.listUserByRoom.forEach((user: UserInRoomResponse) => {
      atValues.push({
        userId: user?.userId,
        value: `${user?.user?.firstName} ${user?.user?.lastName}`,
        avatar: user?.user?.avatar
          ? user?.user?.avatar
          : 'https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg',
      });
    });

    const editorSelector = '#editor';

    const renderMentionItem = (item: ChatInterface) => {
      const container = document.createElement('div');

      container.classList.add('mention-item-container');

      const avatar = document.createElement('img');

      avatar.src = `${item.avatar}`;

      avatar.classList.add('avatar-image-mention');

      const name = document.createElement('span');

      name.innerText = `${item.value}`;

      container.appendChild(avatar);

      container.appendChild(name);

      return container;
    };

    const renderMentions = (searchTerm: string, renderList: (arg0: ChatInterface[], arg1: string) => void) => {
      const matches = atValues.filter(
        (item: ChatInterface) =>
          item?.value?.toLowerCase().toString().includes(searchTerm.toLocaleLowerCase().toString()),
      );

      renderList(matches, searchTerm);
    };

    const settings = {
      formats: ['styled-mention'],
      placeholder: 'Enter your message...',
      modules: {
        mention: {
          allowedChars: /^[A-Za-z\s]*$/,
          mentionDenotationChars: ['@'],
          dataAttributes: ['userId', 'value'],
          blotName: 'styled-mention',
          spaceAfterInsert: false,
          source: renderMentions,
          renderItem: renderMentionItem,
        },
        keyboard: {
          bindings: {
            shift_enter: {
              key: 13,
              shiftKey: true,
              handler: (range: { index: any }) => {
                editor.insertText(range.index, '\n');
                editor.setSelection(range.index + 1, Quill.sources.SILENT);
              },
            },
          },
        },
      },
    };

    const editor = new Quill(editorSelector, settings);
    editor.focus();

    editor.on('text-change', function (delta, oldDelta, source) {
      if (source === 'user') {
        const insertedText = delta.ops[1]?.insert;
        if (typeof insertedText === 'string') {
          const isMentionChar = insertedText.includes('@');
          setEventOpenModelTagName(isMentionChar);
        }
      }
    });

    editorRef.current = editor;

    editor.on('text-change', () => {
      const content = editor.root.innerHTML;

      const tempDiv = document.createElement('div');

      tempDiv.innerHTML = content;

      const mentions = tempDiv.querySelectorAll('.mention');

      mentions.forEach((span) => {
        const name = span.getAttribute('data-value');

        const userId = span.getAttribute('data-user-id');

        if (userId === 'All' && name === 'All') {
          props.handelTagNameAll();
        }

        span.innerHTML = `<span style="color:red" data-name="${name}">@${userId}</span>`;
      });
      const replacedHtmlString = tempDiv.innerHTML;

      const dataMessage = replacedHtmlString
        .replace(/<span\s+class="mention"(.*?)>/g, '<span>')
        .replace(/<span>(?!\s*<span>)([^<]+)<\/span>/g, '$1')
        .slice(3, -4);

      props.handelMessage(dataMessage.replace(/<br\s*\/?>/gi, ''));
    });

    return () => {
      editor.off('text-change', () => {});
      editor.setText('');
    };
  }, [props.listUserByRoom]);

  return (
    <div className="chat-message-atom__container">
      <div
        id="editor"
        className="chat-message-atom-box-editor"
        onKeyDown={
          !eventOpenModelTagName && props.message.trim() !== '' && hasTextContent(props.message)
            ? handleKeyPress
            : emptyFunction
        }
      ></div>
    </div>
  );
};

export default memo(ChatMessage);
