/**
 * 样本数
 * @type {number}
 */
const SAMPLE_COUNT = 160;

/**
 * 过滤规则
 * @param sale
 * @returns {boolean|*}
 */
const filter = sale => Number(sale.PRICE) < 300
    && sale.SCORE
    && Number(sale.SCORE) > 6
    && Number(sale.SCORE) < 10
    && sale.HIT_COUNT >= 0
    && sale.TAGS.includes('中文');

/**
 * 排序规则
 * @param current
 * @param next
 * @returns {number}
 */
const sorter = (current, next) => Number(current.SCORE) - Number(next.SCORE);

const {httpPost, httpRequestAndRun} = require('./utils');


function pushSales(sales) {
    console.log(sales);
    const salesText = sales.list.filter(filter).sort(sorter).map(sale => {
        const id = sale.ID;
        const name = sale.GAME;
        const image = sale.IMAGE;
        const region = sale.REGION_NAME;
        const price = sale.PRICE;
        const tags = sale.TAGS;
        const score = sale.SCORE;

        return `### **${name}** \n` +
            `> ${price}元 ${region}区 [查看](http://www.eshop-switch.com/game/${id}.html) \n\n` +
            `> ![screenshot](${image})\n` +
            `> ###### 网友评分:${score} ${tags}\n------------\n`;
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

    httpPost('https://oapi.dingtalk.com/robot/send?access_token=3be1f454364bc17e6f2c95e16fb7fe44496791588253070ac6016f6ca7fc23fd', allSalesMarkdown);
}

module.exports = () => httpRequestAndRun('http://wap.eshop-switch.com/game/queryGame', {
    current_page: 1,
    up_or_down: 'desc',
    tag: '3',
    page_size: SAMPLE_COUNT
}, pushSales);
