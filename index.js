import { promises as fs } from "fs";

class NobotAi {
  constructor() {
    this.ip_blacklist = [];
    this.isp_blacklist = [];
    this.word_user_agent_blacklist = [];
  }

  async setup() {
    const txtUserAgent = await fs.readFile("user_agent_blacklist.txt", "utf-8");
    this.word_user_agent_blacklist = await txtUserAgent
      .trim()
      .split("\n")
      .map((word) => word.replace(/\r/g, ""));
    const txtIp = await fs.readFile("ip_blacklist.txt", "utf-8");
    this.ip_blacklist = await txtIp
      .trim()
      .split("\n")
      .map((word) => word.replace(/\r/g, ""));
    const txtIsp = await fs.readFile("isp_blacklist.txt", "utf-8");
    this.isp_blacklist = await txtIsp
      .trim()
      .split("\n")
      .map((word) => word.replace(/\r/g, ""));
  }

  async verifyUserAgent(userAgent, callback) {
    if (userAgent.length < 0) throw new Error("userAgent Required");
    const reqUserAgent = userAgent.toLowerCase();
    for (const word of this.word_user_agent_blacklist) {
      if (reqUserAgent.includes(word)) {
        return await callback(true, false);
      }
    }
    return await callback(false, true);
  }

  async verifyIpAddress(ipAddress, callback) {
    // check list blocked ip
    if (!ipAddress) throw new Error("ip address required");
    const { ip_blacklist } = this;
    for (const ip of ip_blacklist) {
      if (ipAddress === ip) {
        return await callback(true, false);
      }
    }
    // check isp
    const res = await fetch(`http://ip-api.com/json/${ipAddress}`);
    const detailsIp = await res.json();
    detailsIp.isp = detailsIp.isp.toLowerCase();
    const { isp_blacklist } = this;
    for (const isp of isp_blacklist) {
      if (detailsIp.isp.includes(isp)) {
        return await callback(true, false);
      }
    }
  }
}

// testing
async function main() {
  const scanning = new NobotAi();
  await scanning.setup();
  const userAgnetExample =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36 msnbot/129.0.0.0";
  const status = await scanning.verifyIpAddress(
    "2345:0425:2CA1:0000:0000:0567:5673:23b5",
    (robot, human) => {
      return human;
    }
  );
  console.log(status);
}
main();

export default NobotAi;
