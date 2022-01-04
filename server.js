const PORT = process.env.PORT || 5050
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()

const sites = [
    {
        name: 'economictimes',
        address: 'https://economictimes.indiatimes.com/topic/web3',
        base: 'https://economictimes.indiatimes.com'
    },
    {
        name: 'ndtv',
        address: 'https://www.ndtv.com/topic/web3',
        base: ''
    },
    {
        name: 'cointelegraph',
        address: 'https://cointelegraph.com/tags/web3',
        base: 'https://cointelegraph.com'
    },
    {
        name: 'bitcoinnews',
        address: 'https://news.bitcoin.com/tag/web3/',
        base: ''
    },
    {
        name: 'entrepreneur',
        address: 'https://www.entrepreneur.com/topic/technology',
        base: ''
    }
]

const blogSites = [
    {
        name: 'hashnode',
        address: 'https://hashnode.com/n/web3',
        base: ''
    },
    {
        name: 'dev.to',
        address: 'https://dev.to/t/web3',
        base: 'https://dev.to'
    }
]

const articles = []
const blogs = []

sites.forEach(site => {
    axios.get(site.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("Web3")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url: site.base + url,
                    source: site.name
                })
            })

            $('a:contains("Web 3.0")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url: site.base + url,
                    source: site.name
                })
            })

        })
})

blogSites.forEach(site => {
    axios.get(site.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("Web3")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                blogs.push({
                    title,
                    url: site.base + url,
                    source: site.name
                })
            })

            $('a:contains("Web 3.0")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                blogs.push({
                    title,
                    url: site.base + url,
                    source: site.name
                })
            })

        })
})

app.get('/', (req, res) => {
    res.json('Welcome to  Web3 News and Articles API !')
})

app.get('/news', (req, res) => {
    res.json(articles)
})

app.get('/articles', (req, res) => {
    res.json(blogs)
})

app.get('/news/:sourceId', (req, res) => {
    const sourceId = req.params.sourceId

    const siteAddress = sites.filter(site => site.name == sourceId)[0].address
    const siteBase = sites.filter(site => site.name == sourceId)[0].base


    axios.get(siteAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("Web3")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: siteBase + url,
                    source: sourceId
                })
            })
            $('a:contains("Web 3.0")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: siteBase + url,
                    source: sourceId
                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))
})

app.get('/articles/:sourceId', (req, res) => {
    const sourceId = req.params.sourceId

    const siteAddress = blogSites.filter(site => site.name == sourceId)[0].address
    const siteBase = blogSites.filter(site => site.name == sourceId)[0].base

    axios.get(siteAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const Articles = []

            $('a:contains("Web3")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                Articles.push({
                    title,
                    url: siteBase + url,
                    source: sourceId
                })
            })
            $('a:contains("Web 3.0")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                Articles.push({
                    title,
                    url: siteBase + url,
                    source: sourceId
                })
            })
            res.json(Articles)
        }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))