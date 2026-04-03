<?php

use App\Http\Controllers\AuthControllers\AuthController;

use App\Http\Controllers\DashboardControllers\CropController;
use App\Http\Controllers\DashboardControllers\ExpenseController;
use App\Http\Controllers\DashboardControllers\ExpensesCategoryController;
use App\Http\Controllers\DashboardControllers\FarmController;
use App\Http\Controllers\DashboardControllers\StatsController;
use App\Http\Controllers\HelperControllers\MailController;
use App\Http\Controllers\ListingControllers\CategoryController;
use App\Http\Controllers\ListingControllers\CommentController;
use App\Http\Controllers\ListingControllers\LikeController;
use App\Http\Controllers\ListingControllers\ListingController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

//for authentication
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::post('logout', [AuthController::class, 'logout']);


Route::group([
    "middleware" => "auth:sanctum"
], function () {

    //Listing/blog routes-------------------------------------------
    //for category in blog page
    Route::resource('categories', CategoryController::class);

    //for listing in blog page
    Route::resource('listings', ListingController::class);
    Route::get('user-listings', [ListingController::class, 'userListings']);

    //for comments
    Route::resource('comments', CommentController::class);

    //csv file upload
    Route::post('upload-listings-csv', [ListingController::class, 'upload']);

    //likes
    Route::post('likes', [LikeController::class, 'toggle']);

    //dashboard routes--------------------------------------------------

    //expenses category
    Route::resource('expenses-categories', ExpensesCategoryController::class);
    //farm
    Route::resource('farms', FarmController::class);
    //crop
    Route::resource('crops', CropController::class);
    //expenses
    Route::resource('expenses', ExpenseController::class);
    Route::get('all-expenses', [ExpenseController::class, 'getAllExpenses']);

    //to get the stats
    Route::get('user-stats', [StatsController::class, 'getUserStats']);
    Route::get('farm-stats/{id}', [StatsController::class, 'getFarmStats']);

});

// Admin routes — requires auth:sanctum AND admin role
Route::group([
    'middleware' => ['auth:sanctum', 'admin'],
], function () {
    Route::get('admin/users', [\App\Http\Controllers\AdminControllers\AdminController::class, 'getUsers']);
    Route::get('admin/users/{id}', [\App\Http\Controllers\AdminControllers\AdminController::class, 'getUser']);
    Route::patch('admin/users/{id}/suspend', [\App\Http\Controllers\AdminControllers\AdminController::class, 'suspendUser']);
    Route::delete('admin/users/{id}', [\App\Http\Controllers\AdminControllers\AdminController::class, 'deleteUser']);
    Route::get('admin/stats', [\App\Http\Controllers\AdminControllers\AdminController::class, 'platformStats']);
});

//to send mail
Route::post('send-mail', [MailController::class, 'sendMail']);

//to forgot and reset password
Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('reset-password', [AuthController::class, 'resetPassword']);


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
