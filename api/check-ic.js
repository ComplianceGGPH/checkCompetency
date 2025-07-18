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
                FTR: matched[10],
                FTRVALID: matched[11],
                FTRCERT: matched[12],
                FTRCARD: matched[13],
                // WATERFALL ABSEILING
                WA: matched[14],
                WAVALID: matched[15],
                WACERT: matched[16],
                WACARD: matched[17],
                // ALL-TERRAIN VEHICLE
                ATV: matched[18],
                ATVVALID: matched[19],
                ATVCERT: matched[20],
                ATVCARD: matched[21],
                // PAINTBALL
                PB: matched[22],
                PBVALID: matched[23],
                PBCERT: matched[24],
                PBCARD: matched[25],
                // SUNSET HIKING / JUNGLE TREKKING / CAVE EXPLORATION
                SHJTCE: matched[26],
                SHJTCEVALID: matched[27],
                SHJTCECERT: matched[28],
                SHJTCECARD: matched[29],
                // TELEMATCH / TEAM BUILDING
                TMTB: matched[30],
                TMTBVALID: matched[31],
                TMTBCERT: matched[32],
                TMTBCARD: matched[33],
                // DRIVER
                DRIVER: matched[34],
                DRIVERVALID: matched[35],
                DRIVERCERT: matched[36],
                DRIVERCARD: matched[37],
            });
        } else {
            return res.json({ message: 'Record not found. Please contact admin.' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
}
