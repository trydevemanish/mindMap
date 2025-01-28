import { NextResponse } from 'next/server';
import puppeteer from "puppeteer";

export async function GET(req: Request){
    try {
        
        const browser = await puppeteer.launch({
            headless : true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        const page = await browser.newPage();

        await page.goto(`${req.url}`, {
            waitUntil: "networkidle0", 
          });
      
        await page.setViewport({ width: 1200, height: 800 });
    
        const pdfBuffer = await page.pdf({ path: "mindmap.pdf", format: "A4",printBackground: true });
        
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