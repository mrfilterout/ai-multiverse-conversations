// Test individual LLM connections
require('dotenv').config({ path: '.env.local' });

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  purple: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Test OpenAI
async function testOpenAI() {
  log('\n=== Testing OpenAI Connection ===', 'green');
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: 'Say "OpenAI connection successful" in 5 words or less' }],
        max_tokens: 20
      })
    });
    
    const data = await response.json();
    if (data.choices) {
      log('✓ OpenAI: Connected successfully', 'green');
      log(`  Response: ${data.choices[0].message.content}`, 'cyan');
    } else {
      throw new Error(data.error?.message || 'Unknown error');
    }
  } catch (error) {
    log(`✗ OpenAI: Connection failed - ${error.message}`, 'red');
  }
}

// Test Anthropic
async function testAnthropic() {
  log('\n=== Testing Anthropic Connection ===', 'purple');
  
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-opus-20240229',
        max_tokens: 20,
        messages: [{ role: 'user', content: 'Say "Anthropic connection successful" in 5 words or less' }]
      })
    });
    
    const data = await response.json();
    if (data.content) {
      log('✓ Anthropic: Connected successfully', 'green');
      log(`  Response: ${data.content[0].text}`, 'cyan');
    } else {
      throw new Error(data.error?.message || 'Unknown error');
    }
  } catch (error) {
    log(`✗ Anthropic: Connection failed - ${error.message}`, 'red');
  }
}

// Test xAI Grok
async function testGrok() {
  log('\n=== Testing xAI Grok Connection ===', 'red');
  
  try {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.XAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'grok-2-latest',
        messages: [{ role: 'user', content: 'Say "Grok connection successful" in 5 words or less' }],
        max_tokens: 20
      })
    });
    
    const data = await response.json();
    
    // Debug: Log full response for xAI
    console.log('xAI Response status:', response.status);
    console.log('xAI Response data:', JSON.stringify(data, null, 2));
    
    if (data.choices) {
      log('✓ xAI Grok: Connected successfully', 'green');
      log(`  Response: ${data.choices[0].message.content}`, 'cyan');
    } else {
      throw new Error(data.error?.message || JSON.stringify(data));
    }
  } catch (error) {
    log(`✗ xAI Grok: Connection failed - ${error.message}`, 'red');
  }
}

// Test DeepSeek
async function testDeepSeek() {
  log('\n=== Testing DeepSeek Connection ===', 'cyan');
  
  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: 'Say "DeepSeek connection successful" in 5 words or less' }],
        max_tokens: 20
      })
    });
    
    const data = await response.json();
    if (data.choices) {
      log('✓ DeepSeek: Connected successfully', 'green');
      log(`  Response: ${data.choices[0].message.content}`, 'cyan');
    } else {
      throw new Error(data.error?.message || 'Unknown error');
    }
  } catch (error) {
    log(`✗ DeepSeek: Connection failed - ${error.message}`, 'red');
  }
}

// Test Google Gemini
async function testGemini() {
  log('\n=== Testing Google Gemini Connection ===', 'yellow');
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: 'Say "Gemini connection successful" in 5 words or less' }]
        }]
      })
    });
    
    const data = await response.json();
    if (data.candidates) {
      log('✓ Google Gemini: Connected successfully', 'green');
      log(`  Response: ${data.candidates[0].content.parts[0].text}`, 'cyan');
    } else {
      throw new Error(data.error?.message || 'Unknown error');
    }
  } catch (error) {
    log(`✗ Google Gemini: Connection failed - ${error.message}`, 'red');
  }
}

// Run all tests
async function runAllTests() {
  log('🚀 Testing LLM Connections', 'blue');
  log('==========================', 'blue');
  
  await testOpenAI();
  await testAnthropic();
  await testGrok();
  await testDeepSeek();
  await testGemini();
  
  log('\n==========================', 'blue');
  log('✅ Connection tests completed', 'blue');
}

// Check if env file exists
const fs = require('fs');
if (!fs.existsSync('.env.local')) {
  log('❌ .env.local file not found!', 'red');
  process.exit(1);
}

runAllTests();