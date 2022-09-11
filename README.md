# 水印姬

快速为证件照、小样图、版权图等敏感照片添加全屏水印。[去这里使用](https://akarin.dev/watermarker/)

![](https://user-images.githubusercontent.com/47057319/189537744-f47b0c95-df5f-4dea-baad-8cdbf60f258d.png)

这个小工具有很多模仿开源的 Android APP [“简单水印”](https://github.com/rosuH/EasyWatermark)的地方，但是我觉得有一个可以跨平台使用的版本会更好 (｡•̀ᴗ-)✧

~~名字是随便取的，图标是随便做的，不要在意……~~

## 特性

* 代码完全开源，你可以随意根据自己的需要对代码进行自行部署和修改。
* 除加载页面静态资源以外，不会发送包括统计埋点在内的任何网络请求，当然也不可能悄悄将图片上传到别处从而使你的隐私被泄露。
  * 对这一点有怀疑的话，你可以随意检查源代码。
  * 由于这个小工具是使用 GitHub Pages 部署的，GitHub 可能会从访客处收集包括 IP 地址日志在内的用户个人信息（参见 [GitHub 的隐私声明](https://docs.github.com/cn/site-policy/privacy-policies/github-privacy-statement#github-%E9%A1%B5%E9%9D%A2)），但是并不会影响这个工具的安全性。
* 支持 PWA 技术。如果你的浏览器支持，可以通过安装 PWA 应用的方式离线使用，获得更好的体验。
* 支持使用文字或图片作为水印内容，任意调节文字样式、旋转角度、不透明度和水印间隔等属性。
* 可以设定保存水印图片时使用的格式及压缩质量。

## 其他

* 一些静态资源进行了压缩，未压缩的版本保存在 `unminified` 目录下。
* 添加 URL 参数 `debug` 可以启用虚拟控制台进行调试。