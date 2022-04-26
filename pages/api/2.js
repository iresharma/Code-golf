
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "POST") {
    console.log(process.env.API_KEY);
    const { code } = req.body;
    let promises = testCases.map((testCase) =>
      axios.post(
        process.env.API_HOST,
        {
          stdin: testCase.stdin,
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
      )
    );
    const responses = await Promise.all(promises);
    const retArray = Array.from({ length: testCases.length });
    responses.forEach(({ data }, index) => {
      if (data.error === "" && data.stderr === "") {
        if (testCases[index].stdout === data.stdout.replace('\n', '')) {
          retArray[index] = {
            testCase: index + 1,
            pass: true,
            stdout: data.stdout,
          };
        } else {
          retArray[index] = {
            testCase: index + 1,
            pass: false,
            stdout: data.stdout,
            error: null,
          };
        }
      } else {
        console.log("reachhh");
        retArray[index] = {
          testCase: index + 1,
          pass: false,
          errText: data.error,
          error: data.stderr,
          stdin: testCases[index].stdin,
        };
      }
    });
    res.status(200).json(retArray);
  }
}

const testCases = [
  {
      stdin: '1 6 45 3 3 9 5 8 15 1 2 3 0 2 3',
      stdout: 'yes'
  },
  {
      stdin: '1 5 50 4 5 3 6 20 0 1 3 2 3',
      stdout: 'yes'
  },
  {
      stdin: '1 5 10 4 5 3 6 20 0 1 3 2 3',
      stdout: 'no'
  },
  {
      stdin: '1 2 10 5 5 0 1',
      stdout: 'no'
  },
  {
      stdin: '1 7 60 5 10 15 20 25 30 35 0 1 2 3 0 1 2',
      stdout: 'yes'
  }
]