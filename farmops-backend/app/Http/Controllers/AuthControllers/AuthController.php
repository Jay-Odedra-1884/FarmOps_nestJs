<?php

namespace App\Http\Controllers\AuthControllers;

use App\Mail\ResetPasswordMail;
use App\Mail\WelcomeMail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use App\Jobs\SendWelcomeMailJob;

class AuthController extends Controller
{
    function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'mobile' => 'nullable|string|max:20',
            'password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => $validator->errors()], 400);
        }

        $data = $validator->validated();
        $user = User::create($data);

        // Send welcome email
        $msg = "Welcome to FarmOps! Your account has been created successfully.";
        SendWelcomeMailJob::dispatch($msg, $user);

        return response()->json(['success' => true, 'message' => 'User registered successfully'], 200);
    }



    function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->errors()->first(),
            ], 422);
        }

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid Creadential',
            ]);
        }

        $user = Auth::user();
        $token = $user->createToken('MyToken')->plainTextToken;

        // Send welcome back email
        // $msg = "Welcome back to FarmOps! You have successfully logged in.";
        // Mail::to($user->email)->send(new WelcomeMail($msg, 'Welcome Back to FarmOps'));
        // SendWelcomeMailJob::dispatch($msg, $user);


        return response()->json([
            'success' => true,
            'message' => 'User logged in',
            'token' => $token,
            'data' => Auth::user(),
        ]);
    }

    function logout(Request $request)
    {

        Auth::logout();

        return response()->json([
            'success' => true,
            'message' => 'User logged out',
        ]);
    }

    function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $user = User::where('email', $request->email)->first();

        // Generate token
        $token = Password::createToken($user);

        $frontendUrl = env('FRONTEND_URL');

        $url = $frontendUrl . '/reset-password?token=' . $token .
            '&email=' . urlencode($user->email);

        // Send SMTP email
        Mail::to($user->email)->send(new ResetPasswordMail($user, $url));

        return response()->json([
            'success' => true,
            'message' => 'Reset link sent to your email'
        ]);


    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'token' => 'required',
            'password' => 'required|min:8|confirmed',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->password = bcrypt($password);
                $user->save();

                // Revoke Sanctum tokens
                $user->tokens()->delete();
            }
        );

        return $status === Password::PASSWORD_RESET
            ? response()->json(['success' => true, 'message' => 'Password reset successful'])
            : response()->json(['success' => false, 'message' => __($status)], 400);
    }

}
