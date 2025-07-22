const API_BASE_URL = 'http://localhost:3000/api';

// Colors for console output
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

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Test 1: Create conversation
async function testCreateConversation() {
  log('\n=== Test 1: Creating new conversation ===', 'blue');
  
  try {
    const response = await fetch(`${API_BASE_URL}/conversations/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    log('✓ Conversation created successfully', 'green');
    log(`  Conversation ID: ${data.conversation.id}`, 'cyan');
    log(`  Initial message: ${data.starter}`, 'yellow');
    
    return data.conversation.id;
  } catch (error) {
    log(`✗ Failed to create conversation: ${error.message}`, 'red');
    throw error;
  }
}

// Test 2: Generate messages
async function testGenerateMessages(conversationId) {
  log('\n=== Test 2: Generating LLM messages ===', 'blue');
  
  const llmOrder = ['openai', 'anthropic', 'grok', 'deepseek', 'gemini'];
  const llmColors = {
    openai: 'green',
    anthropic: 'purple',
    grok: 'red',
    deepseek: 'cyan',
    gemini: 'yellow'
  };
  
  // Generate 5 messages (one from each LLM)
  for (let i = 0; i < 5; i++) {
    const currentLLM = llmOrder[i];
    log(`\n--- Generating message from ${currentLLM.toUpperCase()} ---`, llmColors[currentLLM]);
    
    try {
      const response = await fetch(`${API_BASE_URL}/messages/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }
      
      const data = await response.json();
      log(`✓ Message generated from ${currentLLM}`, 'green');
      log(`  Role: ${data.message.role}`, llmColors[currentLLM]);
      log(`  Content preview: ${data.message.content.substring(0, 100)}...`, 'reset');
      
      // Wait a bit between messages to avoid rate limits
      await delay(2000);
      
    } catch (error) {
      log(`✗ Failed to generate message from ${currentLLM}: ${error.message}`, 'red');
      throw error;
    }
  }
}

// Test 3: Get conversation with messages
async function testGetConversation(conversationId) {
  log('\n=== Test 3: Getting conversation with messages ===', 'blue');
  
  try {
    const response = await fetch(`${API_BASE_URL}/conversations/${conversationId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    log('✓ Conversation retrieved successfully', 'green');
    log(`  Total messages: ${data.messages.length}`, 'cyan');
    log(`  Status: ${data.conversation.status}`, 'yellow');
    
    // Display all messages
    log('\n--- Conversation Flow ---', 'blue');
    data.messages.forEach((msg, index) => {
      const llmColors = {
        openai: 'green',
        anthropic: 'purple',
        grok: 'red',
        deepseek: 'cyan',
        gemini: 'yellow'
      };
      log(`\n[${index + 1}] ${msg.role.toUpperCase()}:`, llmColors[msg.role] || 'reset');
      log(`${msg.content.substring(0, 150)}...`, 'reset');
    });
    
  } catch (error) {
    log(`✗ Failed to get conversation: ${error.message}`, 'red');
    throw error;
  }
}

// Test 4: List all conversations
async function testListConversations() {
  log('\n=== Test 4: Listing all conversations ===', 'blue');
  
  try {
    const response = await fetch(`${API_BASE_URL}/conversations`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    log('✓ Conversations listed successfully', 'green');
    log(`  Total conversations: ${data.conversations.length}`, 'cyan');
    
    data.conversations.slice(0, 5).forEach(conv => {
      log(`  - ${conv.id.substring(0, 8)}... | ${conv.title} | ${conv.status}`, 'yellow');
    });
    
  } catch (error) {
    log(`✗ Failed to list conversations: ${error.message}`, 'red');
    throw error;
  }
}

// Main test runner
async function runTests() {
  log('🚀 Starting LLM Multiverse API Tests', 'blue');
  log('=====================================', 'blue');
  
  try {
    // Test 1: Create conversation
    const conversationId = await testCreateConversation();
    
    // Wait a bit before generating messages
    await delay(2000);
    
    // Test 2: Generate messages
    await testGenerateMessages(conversationId);
    
    // Wait for messages to be saved
    await delay(2000);
    
    // Test 3: Get conversation with messages
    await testGetConversation(conversationId);
    
    // Test 4: List conversations
    await testListConversations();
    
    log('\n✅ All tests completed successfully!', 'green');
    log('=====================================', 'green');
    
  } catch (error) {
    log('\n❌ Tests failed!', 'red');
    log(`Error: ${error.message}`, 'red');
    log('=====================================', 'red');
    process.exit(1);
  }
}

// Run tests if server is ready
async function checkServerAndRun() {
  log('Checking if server is running...', 'yellow');
  
  try {
    const response = await fetch('http://localhost:3000');
    if (response.ok) {
      log('✓ Server is running!', 'green');
      await runTests();
    }
  } catch (error) {
    log('✗ Server is not running. Please start the server with "npm run dev"', 'red');
    process.exit(1);
  }
}

// Start
checkServerAndRun();