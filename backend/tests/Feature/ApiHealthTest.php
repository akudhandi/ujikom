<?php

namespace Tests\Feature;

use Tests\TestCase;

class ApiHealthTest extends TestCase
{
    public function test_api_health_endpoint_returns_ready_message(): void
    {
        $this->getJson('/api/health')
            ->assertOk()
            ->assertJson([
                'message' => 'Laravel API siap.',
            ]);
    }
}
