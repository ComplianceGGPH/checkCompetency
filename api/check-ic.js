// api/check-ic.js
import { google } from 'googleapis';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    let { icNumber } = req.body;
    icNumber = icNumber.replace(/[\s-]/g, '');

    if (!icNumber) {
        return res.status(400).json({ message: 'IC number is required' });
    }

    try {
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        });

        const client = await auth.getClient();
        const sheets = google.sheets({ version: 'v4', auth: client });

        const result = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.SHEET_ID,
            range: "'PTDATA'!A2:P",
        });

        const rows = result.data.values;
        const matched = rows.find((row) => row[15] === icNumber);

        if (matched) {
            return res.json({
                RegNo: matched[1],
                name: matched[2],
                nickname: matched[3],
                WWR: matched[6],
                FTR: matched[7],
                WA: matched[8],
                ATV: matched[9],
                PB: matched[10],
                SHJTCE: matched[11],
                TMTB: matched[12],
                DRIVER: matched[13],
            });
        } else {
            return res.json({ message: 'Record not found. Please contact admin.' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
}
