import os from "os";
import fs from "fs";

export function loadEnv(workdir = ".") {
    if (os.platform() != "win32") {
        return; 
    }
    const p = global.process;
    let f = workdir + "/.env.local";
    if (!fs.existsSync(f)) {
        f = workdir + "/.env";
        if (!fs.existsSync(f)) {
            return;
        }
    }
    const dotEnv = fs.readFileSync(f).toString();
    const envs = Object.fromEntries(dotEnv
        .split(/\r?\n/)
        .filter(l => !!l)
        .map(l => l.split("=")
            .filter(s => !!s)
            .map(s => s
                .trim()
                .replace(/['"]/g, "")
            )
        )
    );
    console.log("load from .env: ", envs)
    Object.assign(p.env, envs);
}


