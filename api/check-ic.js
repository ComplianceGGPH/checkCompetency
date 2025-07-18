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
        const matched = rows.find((row) => row[3] === icNumber);

        if (matched) {
            return res.json({
                RegNo: matched[0],
                name: matched[1],
                nickname: matched[2],
                // WHITE WATER RAFTING
                WWR: matched[7],
                WWRVALID: matched[8],
                WWRCERT: matched[9],
                WWRCARD: matched[10],
                // FUNTRIP RAFTING
                FTR: matched[11],
                FTRVALID: matched[12],
                FTRCERT: matched[13],
                FTRCARD: matched[14],
                // WATERFALL ABSEILING
                WA: matched[15],
                WAVALID: matched[16],
                WACERT: matched[17],
                WACARD: matched[18],
                // ALL-TERRAIN VEHICLE
                ATV: matched[19],
                ATVVALID: matched[20],
                ATVCERT: matched[21],
                ATVCARD: matched[22],
                // PAINTBALL
                PB: matched[23],
                PBVALID: matched[24],
                PBCERT: matched[25],
                PBCARD: matched[26],
                // SUNSET HIKING / JUNGLE TREKKING / CAVE EXPLORATION
                SHJTCE: matched[27],
                SHJTCEVALID: matched[28],
                SHJTCECERT: matched[29],
                SHJTCECARD: matched[30],
                // TELEMATCH / TEAM BUILDING
                TMTB: matched[31],
                TMTBVALID: matched[32],
                TMTBCERT: matched[33],
                TMTBCARD: matched[34],
                // DRIVER
                DRIVER: matched[35],
                DRIVERVALID: matched[36],
                DRIVERCERT: matched[37],
                DRIVERCARD: matched[38],
            });
        } else {
            return res.json({ message: 'Record not found. Please contact admin.' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
}
