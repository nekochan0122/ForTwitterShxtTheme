// ==UserScript==
// @name         ForTwitterShxtTheme
// @author       NekoChan
// @namespace    https://github.com/NekoChanTaiwan
// @version      0.1
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?domain=twitter.com
// @grant        none
// ==/UserScript==

window.onload = async _ => {
  'use strict'

  /* 獲取當前主題顏色並插入動態樣式 */
  const tweetBtnDom = await init()
  const themeColor = window.getComputedStyle(tweetBtnDom).getPropertyValue('background-color')
  insertStyle(themeColor)
}

/**
 * 初始化頁面並返回 "推文(a[href="/compose/tweet"])" HTML 元素
 * @returns { Promise<HTMLElement> }
 */
function init() {
  const observer = listenHtml(callback)

  let tweetBtnDom = null
  let tweetBtnloaded = false
  let tRes = null

  function callback() {
    tweetBtnDom = document.querySelector('a[href="/compose/tweet"]')

    if (tweetBtnDom && !tweetBtnloaded) {
      observer.disconnect()
      tweetBtnloaded = true
      tRes(tweetBtnDom)
    }
  }

  return new Promise(res => {
    tRes = res
  })
}

/**
 * 插入樣式
 * @param { string } themeColor 主題顏色
 * @return { void }
 */
function insertStyle(themeColor) {
  const style = document.createElement('style')
  const styles = document.createTextNode(`
    /* 跟隨按鈕 */
    div[data-testid$='follow'] {
      background-color: ${themeColor} !important;
    }
    div[data-testid$='follow'] span span {
      color: white !important
    }

    /* 取消跟隨按鈕 */
    div[data-testid$='unfollow'] {
      background-color: transparent !important;
      transition: background-color 0.2s;
    }
    div[data-testid$='unfollow']:hover {
      border-color: transparent !important;
      background-color: ${themeColor} !important;
    }
    div[data-testid$='unfollow'] span span {
      color: white !important
    }

    /* 確認取消按鈕 */
    div[data-testid='confirmationSheetConfirm'] {
      background-color: ${themeColor} !important;
    }
    div[data-testid='confirmationSheetConfirm'] div span span {
      color: white !important
    }

    /* 個人資料按鈕 */
    a[href='/settings/profile'] {
      background-color: ${themeColor} !important;
    }
    a[href='/settings/profile'] span span {
      color: white !important;
    }

    /* 個人資料儲存按鈕 */
    div[data-testid='Profile_Save_Button'] {
      background-color: ${themeColor} !important;
    }
    div[data-testid='Profile_Save_Button'] div span span {
      color: white !important
    }

    /* 滾動條 */
    *::-webkit-scrollbar {
      width: 10px;
    }
    *::-webkit-scrollbar-thumb {
      background-color: #5f5f5f;
    }
    *::-webkit-scrollbar-track {
      background-color: #444;
    }
  `)

  style.appendChild(styles)
  document.head.appendChild(style)
}

/**
 * 監聽 HTML (用完請手動 disconnect)
 *
 * @param { MutationCallback } callback
 * @returns { MutationObserver }
 */
function listenHtml(callback) {
  const targetNode = document.documentElement ?? document.body
  const observer = new MutationObserver(callback)

  observer.observe(targetNode, {
    childList: true,
    attributes: true,
    subtree: true,
  })

  return observer
}
