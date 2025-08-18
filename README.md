# TokensOps - Solana Token Operations

A modern Solana token management project built with the latest **@solana/kit** and **@solana-program** packages for creating and managing SPL tokens on Solana.

## 🚀 Features

- ✅ **Modern Solana SDK**: Uses latest @solana/kit (v2.3.0) for enhanced developer experience
- ✅ **Program Direct Access**: Leverages @solana-program/token and @solana-program/system for direct program interaction
- ✅ **Token Mint Creation**: Creates new token mints with customizable decimals
- ✅ **Associated Token Accounts**: Automatically creates and manages ATAs
- ✅ **Token Minting**: Mints initial token supply to specified accounts
- ✅ **SOL Transfers**: Includes SOL transfer functionality for account funding
- ✅ **TypeScript Support**: Full TypeScript implementation with proper type safety
- ✅ **Devnet Ready**: Configured to work on Solana devnet out of the box

## 📋 Prerequisites

- **Node.js** 18+ 
- **pnpm** (recommended) or npm
- **Solana CLI** tools installed
- **Solana devnet** access (or local validator for testing)

## 🛠️ Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd TokensOps

# Install dependencies
pnpm install
```

## ⚡ Quick Start (Frontend)

```bash
# 1) Install deps (once)
pnpm install

# 2) Copy env template and add your Helius key
cp .env.example .env
# edit .env → set VITE_HELIUS_API_KEY=...

# 3) Run the frontend (hot reload)
pnpm run frontend
# opens http://localhost:3000
```

### Minimal iteration loop
- Edit UI in `src/components/Calculator.tsx` and `src/components/Analyzer.tsx`
- Edit analysis logic in `src/utils/transactionAnalyzer.ts`
- Edit constants in `src/constants/index.ts`
- Save to see hot-reload instantly

## 📦 Dependencies

### Core Dependencies
- `@solana/kit` - Modern Solana development toolkit
- `@solana-program/token` - Direct SPL Token program access
- `@solana-program/system` - Direct System program access
- `compute-budget` - Compute budget program utilities
- `react` - React library for building user interfaces
- `react-dom` - React DOM rendering

### Development Dependencies
- `typescript` - TypeScript compiler
- `@types/node` - Node.js TypeScript definitions
- `@types/react` - React TypeScript definitions
- `@types/react-dom` - React DOM TypeScript definitions
- `@vitejs/plugin-react` - Vite plugin for React
- `vite` - Fast build tool and dev server
- `tailwindcss` - Utility-first CSS framework
- `autoprefixer` - CSS vendor prefixing
- `postcss` - CSS transformation tool

## 🚀 Usage

### 1. Configure Your Keypair

The project uses a `keypair.json` file for signing transactions. **⚠️ Never commit this file to version control!**

```bash
# Your keypair.json should contain your private key bytes
# Example: [180,20,222,140,67,201,31,178,...]
```

### 2. Build the Project

```bash
pnpm run build
```

### 3. Run Token Operations

```bash
pnpm start
```

### 4. Development Mode (Watch for Changes)

```bash
pnpm run dev
```

## 🌐 Frontend - P-Token SOL Savings Calculator

This project includes a React frontend for calculating SOL savings when using P-Token instead of SPL Token.

### Running the Frontend

```bash
# Start the development server
pnpm run frontend
# The frontend will open automatically at http://localhost:3000
```

### Frontend Features

- **Interactive Calculator**: Calculate SOL savings for any number of transactions
- **Preset Buttons**: Quick selection for common transaction counts (100, 1k, 10k, 100k)
- **Real-time Updates**: See savings update as you type
- **Detailed Breakdown**: Shows individual instruction costs for both SPL Token and P-Token
- **SOL Savings Calculator**: Primary focus on SOL savings with priority fees
- **CU Savings Display**: Secondary display of compute unit savings

### Frontend Commands

```bash
pnpm run frontend        # Start development server
pnpm run frontend:build  # Build for production
pnpm run frontend:preview # Preview production build
```

### 🔐 Environment

The frontend uses environment variables (Vite) for RPC configuration:

1) Copy and edit the env file
```bash
cp .env.example .env
# set your key
VITE_HELIUS_API_KEY=your_helius_api_key
```

2) Optional overrides
```bash
VITE_DEVNET_RPC=https://devnet.helius-rpc.com
VITE_MAINNET_RPC=https://mainnet.helius-rpc.com
```

Notes:
- `.env` is gitignored; share `.env.example` for collaborators
- If the key is missing, the app will show a helpful error

## 🔧 What the Code Does

1. **Connects** to Solana via Helius RPC (from `.env`)
2. **Loads** your keypair from `keypair.json` for transaction signing
3. **Transfers** 0.01 SOL to a specified receiver address
4. **Creates** a new token mint account with 9 decimals
5. **Initializes** the mint with your address as mint authority
6. **Creates** an associated token account (ATA) for token storage
7. **Mints** 1 token (with 9 decimals = 1,000,000,000 base units) to the ATA

## 🌐 Network Configuration

The frontend reads RPCs from `.env` (Helius). To switch networks, change:

- `VITE_DEVNET_RPC`
- `VITE_MAINNET_RPC`

## 🏗️ Project Structure

```
TokensOps/
├── src/
│   ├── main.tsx                  # React entry point
│   ├── index.css                 # Tailwind CSS imports
│   ├── PTokenCalculator.tsx      # Main container (mode switcher)
│   ├── constants/
│   │   └── index.ts              # TOKEN_PROGRAM_ID, TRANSACTION_TYPES, Helius config
│   ├── hooks/
│   │   └── useTransactionAnalysis.ts
│   ├── utils/
│   │   └── transactionAnalyzer.ts # Log parsing + analysis
│   └── components/
│       ├── Calculator.tsx        # Calculator mode UI
│       ├── Analyzer.tsx          # Analyzer mode UI
│       └── ui/
│           ├── card.tsx
│           ├── button.tsx
│           └── input.tsx
├── dist/                       # Compiled JavaScript (generated)
├── dist-frontend/              # Frontend build output (generated)
├── package.json                # Project dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── vite.config.ts             # Vite configuration for frontend
├── tailwind.config.js         # Tailwind CSS configuration
├── postcss.config.js          # PostCSS configuration
├── index.html                 # Main HTML file for frontend
├── keypair.json               # Your private keypair (gitignored)
└── README.md
```

## 🔑 Key Benefits of This Approach

- **Modern SDK**: Uses the latest @solana/kit for better developer experience
- **Direct Program Access**: Bypasses web3.js for direct program interaction
- **Better Performance**: More efficient transaction building and signing
- **Type Safety**: Excellent TypeScript support throughout
- **Future-Proof**: Built on the latest Solana development patterns

## 🚨 Security Notes

- **NEVER commit `keypair.json` to version control**
- **Use test accounts for development**
- **Keep private keys secure and separate from code**
- **Consider using environment variables for production**

## 🐛 Troubleshooting

- **Connection errors**: Check your internet connection and Solana network status
- **Type errors**: Run `pnpm run build` to check for compilation issues
- **Transaction failures**: Ensure your account has sufficient SOL for fees
- **Keypair errors**: Verify `keypair.json` exists and contains valid bytes
- **Network issues**: Try switching between devnet/testnet or check network status

## 📚 Resources

- [Solana Documentation](https://docs.solana.com/)
- [@solana/kit Documentation](https://github.com/solana-labs/solana-web3.js/tree/master/packages/kit)
- [SPL Token Program](https://spl.solana.com/token)
- [Solana Devnet Faucet](https://faucet.solana.com/)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.
