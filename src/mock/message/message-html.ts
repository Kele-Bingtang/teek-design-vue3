interface Email {
  name?: string;
  subject?: string;
  message?: string;
  email?: string;
}

export const myHtml = (data: Email) => {
  return `<div style="width: 600px;margin: 0 auto;">
            <includetail>
              <table style="text-align: center; font-size: 16px; color: #333333; border-spacing: 0px; border-collapse: collapse; width: 580px; direction: ltr">
                  <tbody>
                  <tr>
                      <td style="font-size: 14px; padding: 0px 0px 7px 0px; text-align: center;color: #0044CC">
                          ${data.name} 在 Young Kbt 首页发送给您
                      </td>
                  </tr>
                  <tr style="background-color: #2279BD">
                      <td style="padding: 0px">
                          <table style="border-spacing: 0px; border-collapse: collapse; width: 100%">
                              <tbody>
                              <tr>
                                  <td style="padding: 0px; text-align: center;">
                                      <img src="https://cdn.jsdelivr.net/gh/Kele-Bingtang/static/user/20211205131212.jpg" alt="请在上方选择信任，以此显示头像">
                                  </td>
                              </tr>
                              <tr>
                                  <td style="font-size: 38px; color: #FFFFFF; padding: 12px 22px 4px 22px; text-align: center;" colspan="3">
                                      Young Kbt
                                  </td>
                              </tr>
                              <tr>
                                  <td style="font-size: 20px; color: #FFFFFF; padding: 0px 22px 18px 22px; text-align: center;" colspan="3">
                                    人闲车马慢，路遥星亦辞
                                  </td>
                              </tr>
                              </tbody>
                          </table>
                      </td>
                  </tr>
                  <tr>
                      <td style="background-color: #5BA9DF; border-bottom-style: solid; border-bottom-color: #2279BD; border-bottom-width: 4px;">
                          <table style="color: #333333; border-spacing: 0px; border-collapse: collapse; width: 100%; color: #fff">
                              <tbody>
                                <tr>
                                  <td style="font-size: 18px; padding: 0px 0px 5px 0px;">
                                    <p style="text-align: left; text-indent: 2rem; color: #333;">
                                      <span style="font-weight:bold;">${data.name} </span>
                                      <span>发送的主题：</span></p>
                                      <p style="font-size: 16px; letter-spacing: 0.5px; text-indent: 16px; padding:0 20px; line-height: 30px; text-align: left;">
                                      ${data.subject}
                                    </p>
                                  </td>
                                </tr>
                                <tr>
                                  <td style="font-size: 18px; padding: 0px 0px 5px 0px;">
                                    <p style="text-align: left; margin-top: 0; text-indent: 2rem; color: #333;">
                                      <span style="font-weight:bold;">${data.name} </span>
                                      <span>发送的内容：</span>
                                    </p>
                                      <p style="font-size: 16px;letter-spacing: 0.5px; text-indent: 16px; padding:0 20px; line-height: 30px; text-align: left;">
                                      ${data.message}
                                    </p>
                                  </td>
                                </tr>
                                <tr>
                                    <td style="font-size: 16px; padding: 30px 20px; text-align: center">
                                      如果您希望回复他/她，请发送到他/她的邮箱：
                                      <p style="color: #0044CC; font-weight: bold">${data.email}</p>
                                    </td>
                                </tr>
                              </tbody>
                          </table>
                      </td>
                  </tr>
                  <tr>
                      <td style="padding: 35px 0px; color: #B2B2B2; font-size: 12px">
                          From Young Kbt
                          <br>
                          This is a WebSite
                          <br>
                          ${new Date().getFullYear()}-${
                            new Date().getMonth() + 1 === 13 ? 12 : new Date().getMonth() + 1
                          }-${new Date().getDate() > 10 ? new Date().getDate() : "0" + new Date().getDate()}
                            ${new Date().getHours() > 10 ? new Date().getHours() : "0" + new Date().getHours()}:${
                              new Date().getMinutes() > 10 ? new Date().getMinutes() : "0" + new Date().getMinutes()
                            }:${new Date().getSeconds() > 10 ? new Date().getSeconds() : "0" + new Date().getSeconds()}
                      </td>
                  </tr>
                  <tr>
                      <td style="padding: 0px 0px 10px 0px; color: #B2B2B2; font-size: 12px">
                          Copyright Young Kbt WebSite
                      </td>
                  </tr>
                  </tbody>
              </table>
            </includetail>
          </div`;
};

export const otherHtml = (data: Email) => {
  return `<div style="width: 600px;margin: 0 auto;">
            <includetail>
              <table
                style="text-align: center; font-size: 16px; color: #333333; border-spacing: 0px; border-collapse: collapse; width: 580px; direction: ltr">
                <tbody>
                  <tr>
                    <td style="font-size: 14px; padding: 0px 0px 7px 0px; text-align: center;color: #0044CC">
                      尊敬的 <span style="font-weight: bold;">${data.name}</span>，Young Kbt 感谢您的邮件
                    </td>
                  </tr>
                  <tr style="background-color: #2279BD">
                    <td style="padding: 0px">
                      <table style="border-spacing: 0px; border-collapse: collapse; width: 100%">
                        <tbody>
                          <tr>
                            <td style="padding: 0px; text-align: center;">
                              <img src="https://cdn.jsdelivr.net/gh/Kele-Bingtang/static/user/20211205131212.jpg" alt="请在上方选择信任，以此显示头像">
                            </td>
                          </tr>
                          <tr>
                            <td style="font-size: 38px; color: #FFFFFF; padding: 12px 22px 4px 22px; text-align: center;"
                              colspan="3">
                              Young Kbt
                            </td>
                          </tr>
                          <tr>
                            <td style="font-size: 20px; color: #FFFFFF; padding: 0px 22px 18px 22px; text-align: center;"
                              colspan="3">
                              人闲车马慢，路遥星亦辞
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="background-color: #5BA9DF; border-bottom-style: solid; border-bottom-color: #2279BD; border-bottom-width: 4px;">
                      <table style="color: #333333; border-spacing: 0px; border-collapse: collapse; width: 100%; color: #fff">
                        <tbody>
                          <tr>
                            <td style="font-size: 18px; padding: 0px 0px 5px 0px;">
                              <p style="text-align: left; text-indent: 2rem; color: #333;">
                                <span style="font-weight:bold">Young Kbt</span>
                                <span>提示您：</span>
                              </p>
                              <p
                                style="font-size: 16px; letter-spacing: 0.5px; text-indent: 2rem; padding:0 20px; line-height: 30px; text-align: left;">
                                本邮件由 Young Kbt's index 网站发送给您，
                                <span style="color: #1546a8; font-weight: bold;">如果非本人操作，请忽略即可。</span>
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td style="font-size: 18px; padding: 0px 0px 5px 0px;">
                              <p style="text-align: left; margin-top: 0; text-indent: 2rem; color: #333;">
                                <span style="font-weight:bold">Young Kbt</span>
                                <span>回复您：</span>
                              </p>
                              <p
                                style="font-size: 16px;letter-spacing: 0.5px; text-indent: 2rem; padding:0 20px; line-height: 30px; text-align: left;">
                                感谢您提供的宝贵消息，我会根据您的内容尽快回复您，如果时间较延迟，请您见谅。
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td style="font-size: 16px; padding: 30px 20px; text-align: center">
                              如果您对我的网站感兴趣，请访问：
                              <p style="color: #0044CC; font-weight: bold">
                               <a href="youngkbt.cn" style="color: #0044CC; text-decoration: none">youngkbt.cn</a>
                              </p>
                              <p style="color: #0c3388;font-size: 14px; margin: 15px 0 0 0;">本网站仅是个人使用，并不带有商业用途</p>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 35px 0px; color: #B2B2B2; font-size: 12px">
                      From Young Kbt
                      <br>
                      This is a WebSite
                      <br>
                      ${new Date().getFullYear()}-${
                        new Date().getMonth() + 1 === 13 ? 12 : new Date().getMonth() + 1
                      }-${new Date().getDate() > 10 ? new Date().getDate() : "0" + new Date().getDate()}
                      ${new Date().getHours() > 10 ? new Date().getHours() : "0" + new Date().getHours()}:${
                        new Date().getMinutes() > 10 ? new Date().getMinutes() : "0" + new Date().getMinutes()
                      }:${new Date().getSeconds() > 10 ? new Date().getSeconds() : "0" + new Date().getSeconds()}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 0px 0px 10px 0px; color: #B2B2B2; font-size: 12px">
                      Copyright Young Kbt WebSite
                    </td>
                  </tr>
                </tbody>
              </table>
            </includetail>
          </div>`;
};
