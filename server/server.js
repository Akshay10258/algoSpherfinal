import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import csvParser from "csv-parser";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const PORT = 5000;
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

let conversationHistory = [];
let pendingMobileNumberRequest = new Map();
let customerData = [];
let bankLoanData = [];

// Load customer loan data
const customerDataPath = path.join(process.cwd(), "Customer Loan Data.csv");
if (fs.existsSync(customerDataPath)) {
  fs.createReadStream(customerDataPath)
    .pipe(csvParser())
    .on("data", (row) => customerData.push(row))
    .on("end", () => console.log("Customer loan data loaded successfully."))
    .on("error", (error) => console.error("Error reading CSV:", error));
} else {
  console.error("Error: Customer Loan Data.csv not found!");
}

// Load bank loan suggestion data
const bankLoanDataPath = path.join(process.cwd(), "Bank Loan Suggestion.csv");
if (fs.existsSync(bankLoanDataPath)) {
  fs.createReadStream(bankLoanDataPath)
    .pipe(csvParser())
    .on("data", (row) => bankLoanData.push(row))
    .on("end", () => console.log("Bank loan suggestion data loaded successfully."))
    .on("error", (error) => console.error("Error reading Bank Loan CSV:", error));
} else {
  console.error("Error: Bank Loan Suggestion.csv not found!");
}

// Fetch user loan details from CSV
const fetchUserLoanDetails = (mobileNumber) => {
  return customerData.find((entry) => entry.mobile_number === mobileNumber) || null;
};

// Enhanced loan suggestion logic with CIBIL score check
const suggestLoanOptions = (loanAmount, income, duration, cibilScore, mobileNumber) => {
  if (bankLoanData.length === 0) {
    return "Sorry, bank loan data is not available at the moment.";
  }

  // Convert params to numbers
  loanAmount = parseInt(loanAmount);
  income = parseInt(income);
  duration = parseInt(duration);
  cibilScore = parseInt(cibilScore);

  // Check CIBIL score eligibility
  if (!cibilScore || cibilScore < 700) {
    return "Sorry, you are not eligible for a loan at this time. A minimum CIBIL score of 700 is required.";
  }

  // Filter suitable loan options
  let suitableLoans = bankLoanData.filter(loan => {
    const minIncome = parseInt(loan["Minimum Income Required (INR)"]);
    const maxLoanAmount = parseInt(loan["Maximum Loan Amount (INR)"]);
    const loanTenure = parseInt(loan["Loan Tenure (years)"]);
    const requiredCibilScore = parseInt(loan["CIBIL Score Requirement"]);
    
    return income >= minIncome && 
           loanAmount <= maxLoanAmount && 
           loanTenure >= duration &&
           cibilScore >= requiredCibilScore;
  });

  suitableLoans.sort((a, b) => parseFloat(a["Interest Rate (%)"]) - parseFloat(b["Interest Rate (%)"]));
  suitableLoans = suitableLoans.slice(0, 3);

  if (suitableLoans.length === 0) {
    return "Sorry, we couldn't find a suitable loan option for your profile despite your eligible CIBIL score.";
  }

  let response = "Congratulations! You are eligible for a loan with your CIBIL score of " + cibilScore + ". Here are some recommended options:\n";
  suitableLoans.forEach((loan, index) => {
    response += `\n**Option ${index + 1}: ${loan["Bank Name"]} - ${loan["Loan Type"]}**
    - Interest Rate: ${loan["Interest Rate (%)"]}%
    - Maximum Loan Amount: ₹${parseInt(loan["Maximum Loan Amount (INR)"]).toLocaleString()}
    - Tenure: Up to ${loan["Loan Tenure (years)"]} years
    - Processing Fee: ${loan["Processing Fee (%)"]}%
    - Min. CIBIL Score: ${loan["CIBIL Score Requirement"]}
    - Prepayment Charges: ${loan["Prepayment Charges (%)"]}%\n`;
  });

  return response;
};

// Define loan application handler
const handleLoanApplication = async (message, userId) => {
  const loanDetailsRegex = /loan\s*amount\s*[-:]*\s*(\d+).*duration\s*[-:]*\s*(\d+).*income\s*[-:]*\s*(\d+)/i;
  const match = message.match(loanDetailsRegex);

  if (match) {
    const loanAmount = parseInt(match[1]);
    const duration = parseInt(match[2]);
    const income = parseInt(match[3]);

    pendingMobileNumberRequest.set(userId, { 
      loanAmount, 
      duration, 
      income,
      step: "awaitingMobile"
    });
    
    return "Thank you! Please provide your registered mobile number to proceed with your loan application.";
  }

  return "To apply for a loan, please provide **loan amount**, **duration**, and **income**.";
};

// Update chat history
const updateConversationHistory = (userMessage, botResponse) => {
  conversationHistory.push({ role: "user", message: userMessage });
  conversationHistory.push({ role: "bot", message: botResponse });

  if (conversationHistory.length > 10) {
    conversationHistory = conversationHistory.slice(-10);
  }
};

// Chatbot API
app.post("/chatbot", async (req, res) => {
  const userMessage = req.body.message;
  const userId = req.body.userId || "defaultUser";

  try {
    let responseText;

    // Handle pending mobile number input for loan application
    if (pendingMobileNumberRequest.has(userId)) {
      const userData = pendingMobileNumberRequest.get(userId);

      if (typeof userData === "object" && userData.step === "awaitingMobile") {
        const mobileNumber = userMessage.trim();
        const userLoanDetails = fetchUserLoanDetails(mobileNumber);

        if (userLoanDetails) {
          const cibilScore = parseInt(userLoanDetails.cibil_score);
          if (cibilScore >= 700) {
            responseText = `Verifying your details for mobile number ${mobileNumber}:\n`;
            responseText += suggestLoanOptions(
              userData.loanAmount,
              userData.income,
              userData.duration,
              cibilScore,
              mobileNumber
            );
          } else {
            responseText = `We found your details for mobile number ${mobileNumber}. However, your CIBIL score of ${cibilScore} is below the required 700. You are not eligible for a loan at this time.`;
          }
        } else {
          responseText = `We couldn't find your details in our records for mobile number ${mobileNumber}. Please try again with a registered mobile number.`;
        }

        pendingMobileNumberRequest.delete(userId);
      } else {
        responseText = "Invalid mobile number. Please enter a valid registered number.";
      }
    } else {
      // Check if user is asking about a loan
      if (userMessage.toLowerCase().includes("loan")) {
        responseText = await handleLoanApplication(userMessage, userId);
      } else {
        // Normal chatbot behavior
        const conversationContext = conversationHistory
          .map((entry) => `${entry.role}: ${entry.message}`)
          .join("\n");

        const prompt = `You are Grok 3, a helpful AI assistant built by xAI. 
        Respond naturally and conversationally to the user's message.
        Maintain conversation memory and respond accordingly.
        Current date is March 15, 2025.
        Here is the conversation history:
        ${conversationContext}
        
        User: ${userMessage}
        AI: `;

        const result = await model.generateContent(prompt);
        responseText = result?.response?.text()?.trim() || "I'm here to assist you!";
      }
    }

    updateConversationHistory(userMessage, responseText);
    res.json({ reply: responseText });

  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});