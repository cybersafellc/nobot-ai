import NobotAi from "..";
import { robot, human, ip } from "./utils.js";

describe("useragent testing", () => {
  it("human user-agent", async () => {
    const antobot = new NobotAi();
    await antobot.setup();
    const isRobot = await antobot.verifyUserAgent(
      human.userAgent,
      (robot, human) => {
        return robot;
      }
    );
    expect(isRobot).toBe(false);
  });

  it("robot user-agent", async () => {
    const antibot = new NobotAi();
    await antibot.setup();
    const isRobot = await antibot.verifyUserAgent(
      robot.userAgent,
      (robot, human) => {
        return robot;
      }
    );
    expect(isRobot).toBe(true);
  });
});

describe("ip/isp testing", () => {
  it("human ip/isp ipv4", async () => {
    const antibot = new NobotAi();
    await antibot.setup();
    const isRobot = await antibot.verifyIpAddress(
      human.ipv4,
      (robot, human) => {
        return robot;
      }
    );
    expect(isRobot).toBe(false);
  });

  it("robot ip/isp ipv4", async () => {
    const antibot = new NobotAi();
    await antibot.setup();
    const isRobot = await antibot.verifyIpAddress(
      robot.ipv4,
      (robot, human) => {
        return robot;
      }
    );
    expect(isRobot).toBe(true);
  });

  it("robot ip/isp ipv6", async () => {
    const antibot = new NobotAi();
    await antibot.setup();
    const isRobot = await antibot.verifyIpAddress(
      robot.ipv6,
      (robot, human) => {
        return robot;
      }
    );
    expect(isRobot).toBe(true);
  });

  it("human ip/isp ipv6", async () => {
    const antibot = new NobotAi();
    antibot.setup();
    const isRobot = await antibot.verifyIpAddress(
      human.ipv6,
      (robot, human) => {
        return robot;
      }
    );
    expect(isRobot).toBe(false);
  });
});

describe("blaklist ip testing", () => {
  it("blacklist ip", async () => {
    const antibot = new NobotAi();
    await antibot.setup();
    const isBlaklist = await antibot.verifyIpAddress(
      ip.blocked,
      (robot, human) => {
        return robot;
      }
    );
    expect(isBlaklist).toBe(true);
  });

  it("no blacklist ip", async () => {
    const antibot = new NobotAi();
    await antibot.setup();
    const isBlaklist = await antibot.verifyIpAddress(
      ip.non_blocked,
      (robot, human) => {
        return robot;
      }
    );
    expect(isBlaklist).toBe(false);
  });
});
