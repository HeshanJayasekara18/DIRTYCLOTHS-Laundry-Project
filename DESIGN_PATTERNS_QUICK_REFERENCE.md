# 🎨 Design Patterns & OOP - Quick Reference Guide
## DIRTYCLOTHS Laundry Project

---

## 📌 Quick Stats

| Category | Count | Status |
|----------|-------|--------|
| **Design Patterns** | 10 | ✅ Implemented |
| **OOP Concepts** | 7 | ✅ Implemented |
| **Architectural Patterns** | 4 | ✅ Implemented |

---

## 🎯 Design Patterns at a Glance

### 1. **MVC Pattern** 🏗️
```
📁 Models      → backend/models/
📁 Views       → frontend/src/
📁 Controllers → backend/controller/
```
**Where:** Entire application structure

---

### 2. **Middleware Pattern** 🔗
```javascript
verifyToken → authorize(['admin']) → controller
```
**Where:** `authMiddleware.js`

---

### 3. **Factory Pattern** 🏭
```javascript
createTransporter() {
  if (production) → SendGrid
  else → Mailtrap
}
```
**Where:** `email.js`

---

### 4. **Strategy Pattern** 🎲
```javascript
generateToken()          // JWT strategy
generateRefreshToken()   // Crypto strategy  
generatePasswordReset()  // Hash strategy
```
**Where:** `auth.js`

---

### 5. **Repository Pattern** 📚
```javascript
userSchema.statics.findByToken(token)
```
**Where:** Mongoose models

---

### 6. **Singleton Pattern** 🎯
```javascript
mongoose.connect() // One DB connection
```
**Where:** Database connection

---

### 7. **Decorator Pattern** 🎨
```javascript
userSchema.pre('save', hashPassword)
```
**Where:** Mongoose hooks

---

### 8. **Observer Pattern** 👁️
```javascript
useEffect(() => {
  // React to state changes
}, [dependency])
```
**Where:** React components

---

### 9. **Module Pattern** 📦
```javascript
const UserModel = {
  register, login, logout,
  setSession, getSession
}
```
**Where:** `UserModel.js`

---

### 10. **Chain of Responsibility** ⛓️
```javascript
rateLimiter → loginLimiter → registerUser
```
**Where:** Express routes

---

## 🏗️ OOP Concepts Map

### 1. **Encapsulation** 🔒
```javascript
// Private password field
password: { type: String, select: false }

// Public method to access
comparePassword(candidatePassword)
```

---

### 2. **Abstraction** 🎭
```javascript
// Hide complexity
createTokens(user) {
  // Complex logic hidden
  return { accessToken, refreshToken }
}
```

---

### 3. **Inheritance** 🧬
```javascript
// Schema inheritance
addresses: [addressSchema]
refreshTokens: [refreshTokenSchema]
```

---

### 4. **Polymorphism** 🔄
```javascript
// Same method, different behavior
generateToken(payload)        // 15m default
generateToken(payload, '7d')  // Custom expiry
```

---

### 5. **Composition** 🧩
```javascript
// Composed schemas
userSchema = {
  addresses: [addressSchema],
  refreshTokens: [tokenSchema]
}
```

---

### 6. **Data Hiding** 🙈
```javascript
toJSON: {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.tokens;
  }
}
```

---

### 7. **Virtual Properties** ✨
```javascript
virtual('isLocked').get(function() {
  return this.lockUntil > Date.now()
})
```

---

## 📂 File-to-Pattern Mapping

| File | Patterns Used |
|------|---------------|
| `User.js` | Encapsulation, Inheritance, Virtual Properties, Decorator |
| `authController.js` | MVC, Strategy, Error Handling |
| `authMiddleware.js` | Middleware, Chain of Responsibility |
| `auth.js` | Strategy, Factory, Abstraction |
| `email.js` | Factory, Abstraction |
| `UserModel.js` | Module, Encapsulation |
| `Service.jsx` | Observer, Composition |
| `db.js` | Singleton |

---

## 🎓 Interview Talking Points

### When asked: "What design patterns did you use?"

**Answer Template:**

> "In my DIRTYCLOTHS Laundry project, I implemented **10 major design patterns**:
> 
> 1. **MVC Pattern** for overall architecture separation
> 2. **Middleware Pattern** for authentication and authorization
> 3. **Factory Pattern** for environment-based email transporter creation
> 4. **Strategy Pattern** for different token generation algorithms
> 5. **Repository Pattern** with Mongoose static methods
> 6. **Singleton Pattern** for database connections
> 7. **Decorator Pattern** using Mongoose pre-save hooks
> 8. **Observer Pattern** in React state management
> 9. **Module Pattern** for frontend service encapsulation
> 10. **Chain of Responsibility** in Express middleware chains
>
> I also applied **7 core OOP principles** including encapsulation, abstraction, inheritance, polymorphism, composition, data hiding, and virtual properties."

---

## 🔍 Code Examples for Interviews

### Example 1: Middleware Pattern
```javascript
// authMiddleware.js
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Not authorized' 
      });
    }
    next();
  };
};

// Usage
router.get('/admin', 
  verifyToken, 
  authorize('admin'), 
  getAdminData
);
```

**Explanation:** Higher-order function that returns middleware, demonstrating both Middleware and Factory patterns.

---

### Example 2: Encapsulation
```javascript
// User.js
const userSchema = new mongoose.Schema({
  password: {
    type: String,
    required: true,
    select: false  // Hidden by default
  }
});

// Public interface
userSchema.methods.comparePassword = async function(pwd) {
  return await bcrypt.compare(pwd, this.password);
};
```

**Explanation:** Password is private (select: false), but accessible through controlled public method.

---

### Example 3: Strategy Pattern
```javascript
// auth.js - Different token strategies
const generateToken = (payload, expiresIn = '15m') => {
  return jwt.sign(payload, secret, { expiresIn });
};

const generateRefreshToken = () => {
  return crypto.randomBytes(40).toString('hex');
};

const generatePasswordResetToken = () => {
  const token = crypto.randomBytes(32).toString('hex');
  return crypto.createHash('sha256').update(token).digest('hex');
};
```

**Explanation:** Three different strategies for token generation, each with specific use case.

---

## 🎯 Best Practices Checklist

- ✅ **Separation of Concerns** (MVC)
- ✅ **DRY Principle** (Utility functions)
- ✅ **Single Responsibility** (Each module has one job)
- ✅ **Open/Closed Principle** (Middleware extensibility)
- ✅ **Dependency Injection** (Mongoose models)
- ✅ **Error Handling** (Try-catch, validation)
- ✅ **Security** (Bcrypt, JWT, rate limiting)
- ✅ **Code Reusability** (Shared utilities)
- ✅ **Scalability** (Modular structure)
- ✅ **Maintainability** (Clear organization)

---

## 📚 Further Reading

### Design Patterns
- **Gang of Four (GoF)** - Classic design patterns book
- **JavaScript Design Patterns** by Addy Osmani
- **Node.js Design Patterns** by Mario Casciaro

### OOP Concepts
- **Clean Code** by Robert C. Martin
- **Object-Oriented JavaScript** by Stoyan Stefanov
- **You Don't Know JS** series

---

## 🚀 Project Highlights

### Architecture Quality: **A+**
- Professional-grade structure
- Industry-standard patterns
- Production-ready code
- Scalable design

### Code Quality: **A+**
- Clean and readable
- Well-documented
- Error handling
- Security-focused

### Best for:
- 📝 Portfolio projects
- 💼 Job interviews
- 🎓 Academic submissions
- 🚀 Production deployment

---

**Last Updated:** 2025-10-08  
**Project:** DIRTYCLOTHS Laundry Management System  
**Developer:** Heshan Jayasekara
