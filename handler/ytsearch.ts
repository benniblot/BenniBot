import puppeteer from 'puppeteer'
import cheerio from 'cheerio'
module.exports = {
    name: 'ytsearch',
    async execute (targetsong: string) {
        // getting HTML Code from Website
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox']
          })

        const page = await browser.newPage()
        await page.goto("https://www.youtube.com/results?search_query=" + targetsong.replace(/ /g,"+"))
        
        const pageData = await page.evaluate(() => {
            return {
                html: document.documentElement.innerHTML,
            }
        })
        await browser.close()
        //Searching the resulting HTML Code for Information
        const $ = cheerio.load(pageData.html);
        const element = $("div[id=dismissible] ytd-thumbnail a[class='yt-simple-endpoint inline-block style-scope ytd-thumbnail']")
        const link = element.attr("href")
        const id = link!.split("=") 
        return id[1]        
    }
};