import passport from "passport";
import tokenService from "../services/tokenService.js";

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

class AuthController {
  googleLogin = passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  });

  googleCallback = (req, res, next) => {
    passport.authenticate("google", { session: false }, async (err, user) => {
      try {
        if (err || !user) {
          return res.redirect(`${CLIENT_URL}/login?error=oauth_failed`);
        }

        const token = tokenService.signToken(user._id);
        return res.redirect(
          `${CLIENT_URL}/auth/callback?token=${encodeURIComponent(token)}`
        );
      } catch (error) {
        return res.redirect(`${CLIENT_URL}/login?error=server_error`);
      }
    })(req, res, next);
  };

  me = async (req, res) => {
    try {
      return res.status(200).json({
        success: true,
        data: {
          id: req.user._id.toString(),
          name: req.user.name,
          email: req.user.email,
          avatar: req.user.avatar,
          isPremium: req.user.isPremium,
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch profile",
      });
    }
  };
}

export default new AuthController();
