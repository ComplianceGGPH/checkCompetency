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
            range: "'DATABASE'!A2:AJ",
        });

        const rows = result.data.values;
        const matched = rows.find((row) => row[23] === icNumber);

        if (matched) {
            return res.json({
                RegNo: matched[0],
                name: matched[1],
                nickname: matched[2],
                // WHITE WATER RAFTING
                WWR: matched[4],
                WWRVALID: matched[5],
                WWRCERT: matched[6],
                WWRCARD: matched[7],
                // FUNTRIP RAFTING
                FTR: matched[8],
                FTRVALID: matched[9],
                FTRCERT: matched[10],
                FTRCARD: matched[11],
                // WATERFALL ABSEILING
                WA: matched[12],
                WAVALID: matched[13],
                WACERT: matched[14],
                WACARD: matched[15],
                // ALL-TERRAIN VEHICLE
                ATV: matched[16],
                ATVVALID: matched[17],
                ATVCERT: matched[18],
                ATVCARD: matched[19],
                // PAINTBALL
                PB: matched[20],
                PBVALID: matched[21],
                PBCERT: matched[22],
                PBCARD: matched[23],
                // SUNSET HIKING / JUNGLE TREKKING / CAVE EXPLORATION
                SHJTCE: matched[24],
                SHJTCEVALID: matched[25],
                SHJTCECERT: matched[26],
                SHJTCECARD: matched[27],
                // TELEMATCH / TEAM BUILDING
                TMTB: matched[28],
                TMTBVALID: matched[29],
                TMTBCERT: matched[30],
                TMTBCARD: matched[31],
                // DRIVER
                DRIVER: matched[32],
                DRIVERVALID: matched[33],
                DRIVERCERT: matched[34],
                DRIVERCARD: matched[35],
            });
        } else {
            return res.json({ message: 'Record not found. Please contact admin.' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
}
