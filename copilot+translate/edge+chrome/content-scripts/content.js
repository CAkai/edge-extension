// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//     $("body").prepend(
//         `<img  src="${request.url}" id="${request.imageDivId}"
//                class="slide-image" /> `
//     );
//     $("head").prepend(
//         `<style>
//           .slide-image {
//               height: auto;
//               width: 100vw;
//           }
//         </style>`
//     );
//     $(`#${request.imageDivId}`).click(function() {
//         $(`#${request.imageDivId}`).remove(`#${request.imageDivId}`);
//     });
//     sendResponse({ fromcontent: "This message is from content.js" });
// });

// 彈出新訊息方便 Debug
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.url) {
//         const img = document.createElement('img');
//         img.src = request.url;
//         img.id = request.imageDivId;
//         document.body.appendChild(img);
//         sendResponse({status: "Image added"});
//     }
// });