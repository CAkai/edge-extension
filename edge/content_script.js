chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("request", request);

  switch (request.type) {
    case "newSkillPopup":
      if (document.getElementById('skills-popup')) {
        console.log("popup already exists");
        return;
      }

      const popup1 = document.createElement('div');
      popup1.id = 'skills-popup';

      // 取得滑鼠位置
      document.addEventListener('mousemove', function (e) {
        popup1.style.left = `${e.pageX / 2 - 300}px`;
        popup1.style.top = `${e.pageY /2 - 150 }px`;
      }, { once: true });

      // 設定 popup 的樣式
      popup1.style.position = 'fixed';
      popup1.style.backgroundColor = 'white';
      popup1.style.color = 'black';
      popup1.style.padding = '1rem 2rem';
      popup1.style.borderRadius = '0.5rem';
      popup1.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
      popup1.style.zIndex = '9999';
      popup1.style.width = '600px';
      popup1.style.height = '300px';
      popup1.style.overflow = 'auto';
      popup1.style.fontSize = '1.1rem';
      document.body.appendChild(popup1);
      
      // 新增操作欄
      const actionbar = document.createElement('div');
      actionbar.style.width='100%';
      actionbar.style.display='flex';
      actionbar.style.justifyContent='flex-end';
      actionbar.style.alignItems='center';
      actionbar.style.marginBottom='1rem';
      actionbar.style.gap='5px';
      actionbar.style.postion="sticky";
      popup1.appendChild(actionbar);

      // 新增複製按鈕，點擊後將內容複製到剪貼簿。圖片路徑是 icons/copy.svg
      const copyButton = document.createElement('button');
      copyButton.id = 'skills-popup-copy';
      copyButton.style.cursor = 'pointer';
      copyButton.title = '複製到剪貼簿';
      copyButton.disabled = true;
      copyButton.innerHTML = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1716212326707" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1456" xmlns:xlink="http://www.w3.org/1999/xlink" width="30" height="30"><path d="M896 810.666667l-128 0c-23.466667 0-42.666667-19.2-42.666667-42.666667 0-23.466667 19.2-42.666667 42.666667-42.666667l106.666667 0c12.8 0 21.333333-8.533333 21.333333-21.333333L896 106.666667c0-12.8-8.533333-21.333333-21.333333-21.333333L448 85.333333c-12.8 0-21.333333 8.533333-21.333333 21.333333l0 21.333333c0 23.466667-19.2 42.666667-42.666667 42.666667-23.466667 0-42.666667-19.2-42.666667-42.666667L341.333333 85.333333c0-46.933333 38.4-85.333333 85.333333-85.333333l469.333333 0c46.933333 0 85.333333 38.4 85.333333 85.333333l0 640C981.333333 772.266667 942.933333 810.666667 896 810.666667zM682.666667 298.666667l0 640c0 46.933333-38.4 85.333333-85.333333 85.333333L128 1024c-46.933333 0-85.333333-38.4-85.333333-85.333333L42.666667 298.666667c0-46.933333 38.4-85.333333 85.333333-85.333333l469.333333 0C644.266667 213.333333 682.666667 251.733333 682.666667 298.666667zM576 298.666667 149.333333 298.666667c-12.8 0-21.333333 8.533333-21.333333 21.333333l0 597.333333c0 12.8 8.533333 21.333333 21.333333 21.333333l426.666667 0c12.8 0 21.333333-8.533333 21.333333-21.333333L597.333333 320C597.333333 307.2 588.8 298.666667 576 298.666667z" p-id="1457"></path></svg>';
      copyButton.addEventListener('click', () => {
        copyContent(popup1.innerText);
        copyButton.innerHTML = '<svg t="1716215991534" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5793" width="30" height="30"><path d="M887.904 298.208c-12.864-12.064-33.152-11.488-45.216 1.408L415.936 753.984l-233.12-229.696c-12.608-12.416-32.864-12.288-45.28 0.32-12.416 12.576-12.256 32.864 0.352 45.248l256.48 252.672c0.096 0.096 0.224 0.128 0.32 0.224s0.128 0.224 0.224 0.32c2.016 1.92 4.448 3.008 6.784 4.288 1.152 0.672 2.144 1.664 3.36 2.144 3.776 1.472 7.776 2.24 11.744 2.24 4.192 0 8.384-0.832 12.288-2.496 1.312-0.544 2.336-1.664 3.552-2.368 2.4-1.408 4.896-2.592 6.944-4.672 0.096-0.096 0.128-0.256 0.224-0.352 0.064-0.096 0.192-0.128 0.288-0.224L889.28 343.424c12.16-12.832 11.488-33.088-1.376-45.216z" fill="" p-id="5794"></path></svg>';
      });
      actionbar.appendChild(copyButton);

      // 新增關閉按鈕，點擊後關閉 popup。圖片路徑是 icons/close.svg
      const closeButton = document.createElement('button');
      closeButton.style.cursor = 'pointer';
      closeButton.title = '關閉';
      closeButton.innerHTML = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1716215702368" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1451" xmlns:xlink="http://www.w3.org/1999/xlink" width="35" height="35"><path d="M810 274l-238 238 238 238-60 60-238-238-238 238-60-60 238-238-238-238 60-60 238 238 238-238z" p-id="1452"></path></svg>';
      closeButton.addEventListener('click', () => {
        popup1.remove();
      });
      actionbar.appendChild(closeButton);
      
      // 新增文字框
      const textarea = document.createElement('div');
      textarea.id = 'skills-popup-textarea';
      textarea.style.width='100%';
      textarea.innerText = 'Loading...';
      popup1.appendChild(textarea);


      break;
    case "updateSkillPopup":
      const popup2 = document.getElementById('skills-popup');
      const textarea1 = document.getElementById('skills-popup-textarea');
      const copyButton1 = document.getElementById('skills-popup-copy');
      if (popup2 && textarea1) {
        console.log("request.skills", request.skills);
        textarea1.innerText = request.skills;
        copyButton1.disabled = false;

        // 重新加入到 body 中，讓 popup 重新 render
        document.body.removeChild(popup2);
        setTimeout(() => {
          document.body.appendChild(popup2);
        }, 0);

      }

      break;
    default:
      console.log("unknown request type", request);
      break;
  }
  


    // 如果點擊 popup 之外的地方，popup 會消失
    // document.addEventListener('click', (e) => {
    //   console.log(e);
    //     if (!popup.contains(e.target)) {
    //         popup.remove();
    //     }
    // }, { once: true });
});

async function copyContent(text) {
  try {
    await navigator.clipboard.writeText(text);
    console.log('Content copied to clipboard');
    /* Resolved - 文本被成功复制到剪贴板 */
  } catch (err) {
    console.error('Failed to copy: ', err);
    /* Rejected - 文本未被复制到剪贴板 */
  }
}
