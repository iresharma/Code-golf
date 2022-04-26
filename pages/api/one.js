// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "POST") {
    console.log(process.env.API_KEY);
    const { code } = req.body;
    const { data } = await axios.post(
      process.env.API_HOST,
      {
        stdin: "3 4",
        files: [
          {
            name: "main.c",
            content: code,
          },
        ],
      },
      {
        headers: {
          Authorization: `Token ${process.env.API_KEY}`,
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
    console.log(data);
    if (data.error === "" && data.stderr === "" && data.stdout === "Sum = 7") {
      res.status(200).json({ pass: "pass" });
    } else {
      res
        .status(200)
        .json({ pass: "error", stderr: data.stderr, error: data.error });
    }
  }
}

const testCases = [
  {
      stdin: '3 RRG',
      stdout: '2'
  },
  {
      stdin: '5 RRRRR',
      stdout: '1'
  },
  {
      stdin: '4 BRBG',
      stdout: '4'
  },
  {
      stdin: '5 RRBRBR',
      stdout: '4'
  },
  {
      stdin: '1 R',
      stdout: '1'
  },
  {
      stdin: '7 BRRRGGB',
      stdout: '4'
  },
  {
      stdin: '43 RBGRBRBBGGRBRRRBRGRGBRGGRRRGBGBBRBBRBGGBGBB',
      stdout: '32'
  },
  {
      stdin: '31 RBGGRGGBGGBBRRGBGRRRGGGRGRGRRGB',
      stdout: '21'
  }
]