import zh_CN_content from "../i18n/zh";
import en_content from "../i18n/en";
import {LanguageList, LanguageParam} from "@/constants/index"
import {TabBarList_EN, TabBarList_page, TabBarList_ZH_CN} from "../i18n/config";
import Taro from "@tarojs/taro";
import { findKey } from 'lodash';
import {switchLanguage} from "@/modules/common";
import {getCurrentPage, getPageUrl} from "@/utils/page";

/**
 * 国际化工具类
 */

class I18n {
  constructor() {
    this.data = {
      lang: LanguageList.ZH_CN,
    }
  }

  /**
   * 判断是否是英文版
   * @return {boolean}
   */
  isEn() {
    return this.data.lang === LanguageList.EN;
  }

  /**
   * 获取当前语言对应的接口提交值
   */
  getLangSubmitValue() {
    let key = findKey(LanguageList, item => item === this.data.lang);
    return LanguageParam[key];
  }

  /**
   * 设置当前语言
   * @param lang {string}
   */
  setLang(lang) {
    this.data.lang = lang;
  }

  /**
   * 获取key值对应的语言
   * @param key {string}
   */
  t(key) {
    let content = zh_CN_content;
    if(this.data.lang === LanguageList["EN"]) {
      content = en_content;
    }
    let keyArr = key.split(".");
    try {
      let value = content[keyArr[0]];
      keyArr.splice(0, 1);
      keyArr.forEach(k => {
        value = value[k] ? value[k] : value;
      })
      return value;
    } catch (err) {
      console.log(err);
      return new Error(`翻译${key}出错`)
    }
  }

  /**
   * 切换语言并初始化小程序
   * @param lang {string} LanguageList的值
   */
  async initGlobalLanguage(lang) {
    this.setLang(lang);
    // await switchLanguage(this.getLangSubmitValue());
    this._initTabBarList(lang);
  }

  _initTabBarList(lang) {
    if(TabBarList_page.find(item => item.pagePath.includes(getCurrentPage().route))) {} else { return }
    let tabBarList = TabBarList_ZH_CN;
    if (lang === LanguageList.EN) {
      tabBarList = TabBarList_EN;
    }
    tabBarList.forEach((item, index)  => {
      Taro.setTabBarItem({
        text: item,
        index
      });
    })
  }

  /**
   * 页面设置标题
   * @param zh
   * @param en
   */
  initNavBarTitle(title) {
    // let title = zh;
    // if (this.data.lang === LanguageList.EN) {
    //   title = en;
    // }
    Taro.setNavigationBarTitle({ title });
    this._initTabBarList(this.data.lang);
  }

}

const i18n = new I18n();

export default i18n;
export const t = i18n.t;
