import jwt from 'jsonwebtoken';

export default function GenerateToken(user) {
    return jwt.sign(
        {
            _id: user._id,
            name: user.name,
            email: user.email,
        },
        process.env.JWT_SECRET, // Ensure this matches in verification
        {
            expiresIn: '30d',
        }
    );
}
