import { NextResponse } from 'next/server';
import puppeteer from "puppeteer";

export async function POST(req: Request){
    try {

        const { description }: {description : string} = await req.json()
        
        const browser = await puppeteer.launch({
            headless : true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        const page = await browser.newPage();

        const url = new URL(req.url);
        const baseUrl = `${url.protocol}//${url.host}`

        await page.goto(`${baseUrl}/newpage`, {
            waitUntil: "networkidle0", 
        });
      
        await page.setViewport({ width: 1200, height: 800 });
    
        const pdfBuffer = await page.pdf({ path: `${description.slice(0,30)}.pdf`, format: "A4",printBackground: true });
        
        await browser.close();

        return new NextResponse(pdfBuffer, {
            headers: {
              'Content-Type': 'application/pdf',
              'Content-Disposition': 'attachment; filename="mindmap.pdf"',
            },
        });

    } catch (error) {
        return NextResponse.json(
            { message: error ?? 'Failed to generate PDF' },
            { status: 500 }
        );
    }
}