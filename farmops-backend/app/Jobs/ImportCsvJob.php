<?php

namespace App\Jobs;

use App\Models\Listing;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class ImportCsvJob implements ShouldQueue
{
    use Queueable;


    protected $path;
    protected $userId;
    /**
     * Create a new job instance.
     */
    public function __construct($path, $userId)
    {
        $this->path = $path;
        $this->userId = $userId;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        if(($handle = fopen($this->path, 'r')) !== false) {
            $rows = [];
            fgetcsv($handle); // Skip the header row

            while(($data = fgetcsv($handle, 0, ',')) !== false) {
               if(count($data) >= 4) {
                    $rows[] = [
                        'title' => $data[0],
                        'description' => $data[1],
                        'category_id' => $data[2],
                        'user_id' => $this->userId,
                    ];

                    if(count($rows) >= 100) {
                        Listing::insert($rows);
                        $rows = [];
                    }
               }
            }
            if (!empty($rows)) {
                Listing::insert($rows);
            }

            fclose($handle);
        }
    }
}
