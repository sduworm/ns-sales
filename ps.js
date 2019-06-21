/**
 * 样本数
 * @type {number}
 */
const SAMPLE_COUNT = 50;

const {httpPost, httpGetAndRun} = require('./utils');

function pushSales(sales) {
    console.log(sales.data.list);
    const salesText = sales.data.list.map(sale => {
        const id = sale.id;
        const name = sale.display_name || sale.translate_name || sale.name;
        const image = sale.thumbnail_url;
        const price = Number(sale.non_plus_user_price) / 100;
        const plusPrice = Number(sale.plus_user_price) / 100;
        const tags = [sale.sku_name, ` 中文：${sale.support_chinese ? '有' : '无'}`];
        const percentage = Number(sale.non_plus_discount_percentage) / 10;
        const plusPercentage = Number(sale.plus_discount_percentage) / 10;

        return `### **${name}**  \n` +
            `> [查看](https://www.diamondyuan.com/playstation/${id}?region=HONG_KONG)  \n\n` +
            `> ￥${(price * 0.88).toFixed(2)} (HK$${price}) |   \n` +
            `> PSN+ **￥${(plusPrice * 0.88).toFixed(2)}** (HK$${plusPrice})  \n` +
            `> ${percentage}折 | PSN+ ${plusPercentage}折 \n\n` +
            `> ![screenshot](${image})  \n` +
            `> ###### ${String(tags)}\n------------\n`;
    });

    const allSalesMarkdown = {
        msgtype: "markdown",
        markdown: {
            title: "最新折扣",
            text: salesText.reduce((p, c) => (p + '\n\n' + c), '')
        }
    };

    console.log(allSalesMarkdown);
    console.log(salesText.length);

    httpPost('https://oapi.dingtalk.com/robot/send?access_token=5898df81544edd4797c535cc2e008f557196e26c24276f4a92820d9df86af4c3', allSalesMarkdown);
}

module.exports = () => httpGetAndRun('https://services.diamondyuan.com/365call-api/api/v3/games', {
    sort: 'PLUS_SALE_START_DATE_DESC',
    is_discount: true,
    support_chinese: true,
    is_release: true,
    region: 'HONG_KONG',
    content_type: 'GAME',
    platform: 'PS4,PS4%C2%AE',
    page: 1,
    page_size: SAMPLE_COUNT
}, pushSales);
