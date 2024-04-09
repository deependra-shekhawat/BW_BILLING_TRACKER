import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import fs from 'fs';

class UserController {
    static async signin(req, res) {
        const { user, password } = req.body;

        // Read user info from text file
        fs.readFile('user_info.txt', 'utf8', async (err, data) => {
            if (err) {
                console.error('Error reading user info:', err);
                return res.status(500).send('Error reading user info');
            }

            const lines = data.split('\n');
            for (let line of lines) {
                if (!line) continue; // Skip empty lines
                const userInfo = JSON.parse(line);
                
                // Check if the user exists
                if (userInfo.user === user) {
                    // Compare passwords
                    const match = await bcrypt.compare(password, userInfo.password);
                    if (match) {
                        // Generate JWT token with user information
                        const token = jwt.sign({ user: userInfo }, process.env.JWT_SECRET, { expiresIn: '1h' });
                        
                        // Set cookie with token
                        res.cookie('token', token, { httpOnly: true });
                        return res.redirect('/bandwidth');
                    }
                }
            }

            // If the loop completes without finding a match, credentials are invalid
            req.flash('error', 'Invalid username or password ☹️');
            return res.redirect('/'); // Redirect back to the login page
        });
    }

    static async signup(req, res) {
        const user = "testuser";
        const password = "test@pass";

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Store user info in memory
        const userInfo = { user, password: hashedPassword };

        // Save user info to text file
        fs.appendFile('user_info.txt', JSON.stringify(userInfo) + '\n', (err) => {
            if (err) {
                console.error('Error saving user info:', err);
                return res.status(500).send('Error saving user info');
            }
            res.send('User registered successfully');
        });
    }

    static signout(req, res) {
        // Clear JWT token by setting an expired cookie
        res.cookie('token', '', { expires: new Date(0) });
        req.user = null;
        // Redirect to layout page
        res.redirect('/');
    }
}

export default UserController;
