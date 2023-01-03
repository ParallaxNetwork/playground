import Document, { Head, Html, Main, NextScript } from 'next/document'

export default class CustomDocument extends Document {
    render() {
        return (
            <Html lang="id">
                <Head />
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"></meta>
                <link rel="icon" href="/assets/picture/blockbanner.png" />
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html >
        )
    }
}
