import crypto from 'crypto';
export const renderRegister = (req, res) => {
    res.send('Render Register page here');
};
export const handelRegister = (req, res) => {
    console.log(req.body);
    const hashPassword = (password) => {
        return crypto.createHash('sha256').update(password).digest('hex');
    };
    const password = hashPassword(req.body.password);
    console.log(password);
    res.json({ success: false, message: 'Failed' });
};
