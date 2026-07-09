import { readFileSync } from "node:fs";

const HOST = "passinglane.app";
const KEY = "7c7e5ad4e68f4f1fb30ef2a201c2f6a9";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = "https://api.indexnow.org/indexnow";

function readUrls() {
  const sitemap = readFileSync("sitemap.xml", "utf8");
  const urls = [
    `https://${HOST}/`,
    ...[...sitemap.matchAll(/<loc>(https:\/\/passinglane\.app\/[^<]+)<\/loc>/g)]
      .map((match) => match[1]),
  ];

  urls.push(`https://${HOST}/llms.txt`, `https://${HOST}/llms-full.txt`);

  return [...new Set(urls)].sort();
}

async function submit(urlList) {
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: KEY_LOCATION,
      urlList,
    }),
  });

  if (response.status !== 200 && response.status !== 202) {
    const body = await response.text();
    throw new Error(`IndexNow returned ${response.status}: ${body}`);
  }

  console.log(`Submitted ${urlList.length} URLs to IndexNow with status ${response.status}.`);
}

const urls = readUrls();

if (process.env.DRY_RUN === "1") {
  console.log(urls.join("\n"));
} else {
  await submit(urls);
}
