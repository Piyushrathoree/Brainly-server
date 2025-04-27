"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserProfile = exports.LogoutUser = exports.ResetPassword = exports.ForgotPassword = exports.VerifyUser = exports.LoginUser = exports.RegisterUser = void 0;
const RegisterUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(201).send({ message: "User registered successfully" });
});
exports.RegisterUser = RegisterUser;
const LoginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).send({ message: "User logged in successfully" });
});
exports.LoginUser = LoginUser;
const VerifyUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).send({ message: "User verified successfully" });
});
exports.VerifyUser = VerifyUser;
const ForgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).send({ message: "Password reset link sent successfully" });
});
exports.ForgotPassword = ForgotPassword;
const ResetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).send({ message: "Password reset successfully" });
});
exports.ResetPassword = ResetPassword;
const LogoutUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).send({ message: "User logged out successfully" });
});
exports.LogoutUser = LogoutUser;
const GetUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).send({ message: "User profile fetched successfully" });
});
exports.GetUserProfile = GetUserProfile;
