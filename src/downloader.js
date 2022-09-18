const { execSync } = require("child_process");

class Downloader {
    static downloadMediaFromUrl(url, subdir) {
        try {
            execSync("yt-dlp " + url, {
                cwd: '/downloads/' + subdir
            },
            (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    return;
                }
                console.log(`stdout: ${stdout}`);
            });
        } catch(ex) {
            // TBA
        }
    }

    static updateYtdlp() {
        console.log('checking for yt-dlp updates...');
        
        try {
            execSync("yt-dlp -U",
            (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    return;
                }
                console.log(`stdout: ${stdout}`);
            });
        } catch(ex) {
            // TBA
        }
    }
}

module.exports = Downloader;
