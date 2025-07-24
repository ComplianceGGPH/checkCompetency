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
            range: "'DATABASE'!A2:AZ",
        });

        const rows = result.data.values;
        const matched = rows.find((row) => row[3] === icNumber);

        if (matched) {
            return res.json({
                RegNo: matched[0],
                name: matched[1],
                nickname: matched[2],
                // WHITE WATER RAFTING
                WWR: matched[6],
                WWRVALID: matched[7],
                WWRCERT: matched[8],
                WWRCARD: matched[9],
                // FUNTRIP RAFTING
                // FTR: matched[10],
                // FTRVALID: matched[11],
                // FTRCERT: matched[12],
                // FTRCARD: matched[13],
                // WATERFALL ABSEILING
                WA: matched[10],
                WAVALID: matched[11],
                WACERT: matched[12],
                WACARD: matched[13],
                // ALL-TERRAIN VEHICLE
                ATV: matched[14],
                ATVVALID: matched[15],
                ATVCERT: matched[16],
                ATVCARD: matched[17],
                // PAINTBALL
                PB: matched[18],
                PBVALID: matched[19],
                PBCERT: matched[20],
                PBCARD: matched[21],
                // SUNSET HIKING / JUNGLE TREKKING / CAVE EXPLORATION
                SHJTCE: matched[22],
                SHJTCEVALID: matched[23],
                SHJTCECERT: matched[24],
                SHJTCECARD: matched[25],
                // TELEMATCH / TEAM BUILDING
                TMTB: matched[26],
                TMTBVALID: matched[27],
                TMTBCERT: matched[28],
                TMTBCARD: matched[29],
                // DRIVER
                DRIVER: matched[30],
                DRIVERVALID: matched[31],
                DRIVERCERT: matched[32],
                DRIVERCARD: matched[33],
            });
        } else {
            return res.json({ message: 'Record not found. Please contact admin.' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
}
