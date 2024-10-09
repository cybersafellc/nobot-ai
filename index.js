import { promises as fs } from "fs";

class NobotAi {
  constructor() {
    this.ip_blacklist = [];
    this.isp_blacklist = [];
    this.word_user_agent_blacklist = [];
  }

  async init() {
    const txtUserAgent = await fs.readFile("user_agent_blacklist.txt", "utf-8");
    this.word_user_agent_blacklist = txtUserAgent
      .trim()
      .split("\n")
      .map((word) => word.replace(/\r/g, ""));
    const txtIp = await fs.readFile("ip_blacklist.txt", "utf-8");
    this.ip_blacklist = txtIp
      .trim()
      .split("\n")
      .map((word) => word.replace(/\r/g, ""));
    const txtIsp = await fs.readFile("isp_blacklist.txt", "utf-8");
    this.isp_blacklist = txtIsp
      .trim()
      .split("\n")
      .map((word) => word.replace(/\r/g, ""));
  }

  async verifyUserAgent(userAgent, callback) {
    if (userAgent.length < 0) throw new Error("userAgent Required");
    const reqUserAgent = userAgent?.toLowerCase();
    for (const word of this.word_user_agent_blacklist) {
      if (reqUserAgent.includes(word)) {
        return await callback(true, false);
      }
    }
    return await callback(false, true);
  }

  async verifyIpAddress(ipAddress, callback) {
    // check list blocked ip
    if (!ipAddress) return await callback(true, false);
    const { ip_blacklist } = this;
    for (const ip of ip_blacklist) {
      if (ipAddress.includes(ip)) {
        return await callback(true, false);
      }
    }
    // check isp
    const res = await fetch(`http://ip-api.com/json/${ipAddress}`);
    const detailsIp = await res.json();
    if (!detailsIp.isp) {
      return await callback(true, false);
    }
    detailsIp.isp = detailsIp?.isp?.toLowerCase();
    detailsIp.org = detailsIp?.org?.toLowerCase();
    detailsIp.as = detailsIp?.as?.toLowerCase();
    const { isp_blacklist } = this;
    for (const isp of isp_blacklist) {
      if (
        detailsIp?.isp?.includes(isp) ||
        detailsIp?.as?.includes(isp) ||
        detailsIp?.org?.includes(isp)
      ) {
        return await callback(true, false);
      }
    }
    return await callback(false, true);
  }

  async completeVerify(userAgent, ipAddress, callback) {
    if (!userAgent || !ipAddress) return await callback(true, false);
    //check user agent
    const newUserAgent = userAgent.toLowerCase();
    const { word_user_agent_blacklist } = this;
    for (const word of word_user_agent_blacklist) {
      if (newUserAgent.includes(word)) {
        return await callback(true, false);
      }
    }
    // check ip blacklist
    const { ip_blacklist } = this;
    for (const ip of ip_blacklist) {
      if (ipAddress.includes(ip)) {
        return await callback(true, false);
      }
    }
    // check isp
    const res = await fetch(`http://ip-api.com/json/${ipAddress}`);
    const response = await res.json();
    if (!response.isp) return await callback(true, false);
    response.org = response.org.toLowerCase();
    response.isp = response.isp.toLowerCase();
    response.as = response.as.toLowerCase();
    const { isp_blacklist } = this;
    for (const isp of isp_blacklist) {
      if (
        response.isp.includes(isp) ||
        response.as.includes(isp) ||
        response.org.includes(isp)
      ) {
        return await callback(true, false);
      }
    }
    return await callback(false, true);
  }
}

export default NobotAi;
