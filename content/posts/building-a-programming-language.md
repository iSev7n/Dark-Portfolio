# Building a Programming Language in JavaScript: Genesis Script v2

Genesis Script started as a small experiment.

I wanted a beginner-friendly scripting language inspired by biblical terminology — something readable, structured, and safe enough for exploration. It was originally a learning tool.

Genesis Script v2 is not a toy rewrite.

It is a refactor and a deliberate security-hardening pass that evolved into a real language toolchain:

- Tokenizer  
- Parser  
- Interpreter  
- Transpiler  
- CLI tooling  
- Test suite  

Genesis Script files use the `.gs` extension.

This post walks through how the system is structured, why certain architectural decisions were made, and what changes when you move from “experimental language” to something you can actually trust.

---

## Why build a language at all?

Most developers never need to build a programming language.

I built one because it forces you to confront multiple engineering disciplines simultaneously:

- Designing syntax humans can actually read  
- Constructing a deterministic pipeline from source code to execution  
- Representing structure with ASTs  
- Designing meaningful error messages  
- Defining safe execution boundaries  
- Building tooling that makes it usable  

A language project compresses several years of architectural lessons into one system.

Even if Genesis Script remains niche, the skills transfer directly into:

- DSL design  
- Configuration parsers  
- Automation engines  
- Sandboxed evaluators  
- Build tools and code generation systems  

Languages expose your assumptions. They do not tolerate ambiguity.

---

## Core goals for Genesis Script v2

Version 2 was guided by four practical goals.

They sound simple until you implement them.

### 1) Beginner-friendly

Readable syntax. Limited magic. Predictable evaluation.

That means:

- Explicit keywords  
- No hidden coercion rules  
- Clear control flow  
- Consistent scoping  

The language should reward clarity, not cleverness.

---

### 2) Safe by default

The runtime should be hostile to:

- Infinite loops without limits  
- Unbounded recursion  
- Implicit access to host APIs  
- Accidental global mutation  

If a beginner writes unsafe code, the runtime should stop it cleanly.

Safety is not an add-on. It must be structural.

---

### 3) Clean, staged pipeline

A real toolchain is not “parse and hope.”

It is a deterministic pipeline:

1. **Lexing (Tokenizer)** – characters → tokens  
2. **Parsing** – tokens → AST  
3. **Execution (Interpreter)** – AST → runtime behavior  
4. **Transpilation (optional)** – AST → target output  

Each stage has one job.

If your parser executes logic, you lose clarity.
If your interpreter fixes token mistakes, you lose structure.

Separation is not elegance. It is survival.

---

### 4) Good errors

Beginner languages fail without readable errors.

Errors must answer:

- What happened  
- Where it happened  
- Why it happened  
- What to try next  

“Unexpected token” is not enough.

Error quality determines whether a language feels usable or hostile.

---

## Toolchain architecture

The pipeline can be visualized simply:

```
source (.gs)
  -> tokenize
  -> parse (AST)
  -> interpret OR transpile
  -> output
```

The rule that keeps everything maintainable:

> Every stage receives clean input and produces clean output.

The moment stages leak responsibility into each other, the system becomes fragile.

---

## Stage 1: Tokenization (Lexing)

The tokenizer converts raw text into structured tokens.

Example:

```gs
let x = 5 + 2
```

Becomes:

```
LET IDENT(x) EQUAL NUMBER(5) PLUS NUMBER(2)
```

### What the tokenizer handles

- Whitespace and newlines  
- Identifiers  
- Numbers and strings  
- Comments  
- Operators  
- Punctuation  
- Reserved keywords  

Tokens carry metadata:

- type  
- value  
- line  
- column  

Line and column data power meaningful error messages later.

### Hardening measures

In v2, I added limits at this stage:

- Maximum source size  
- Maximum token count  
- Maximum string length  

The tokenizer is the first defensive boundary. It should reject pathological input early.

---

## Stage 2: Parsing (Tokens → AST)

Once tokenized, the parser builds an **Abstract Syntax Tree**.

The AST is the real language.

Instead of executing text, you execute structured nodes.

Example:

```gs
let total = 10 + 5
```

AST sketch:

```
VarDecl(
  name="total",
  init=BinaryExpr(
    left=Number(10),
    op="+",
    right=Number(5)
  )
)
```

### Operator precedence

The moment you support arithmetic, precedence becomes mandatory.

```
1 + 2 * 3
```

Must resolve correctly.

A typical structure:

- parseExpression  
- parseTerm  
- parseFactor  

Simple recursive descent parsing works well for a controlled grammar.

### Parser error handling

Serious parsers do not throw generic errors.

They should report:

- Expected token  
- Actual token  
- Line and column  
- Optional code snippet  

The parser is where most beginner frustration happens. Clear errors matter.

---

## Stage 3: Interpreter (Executing the AST)

The interpreter walks the AST and evaluates nodes.

Typical architecture:

- Visitor pattern for node types  
- Environment object for scope  

### Environment design

The environment stores:

- Variable declarations  
- Lookups  
- Assignments  

Nested scopes require chaining:

- Global scope  
- Function scope  
- Block scope  

In v2, strict rules improved safety:

- Variables must be declared before use  
- Assigning undeclared variables throws  
- Shadowing rules are explicit  

Strictness improves predictability.

### Example `.gs` program

```gs
let name = "Thomas"
let score = 7

if score >= 5 {
  say "Pass: " + name
} else {
  say "Try again"
}
```

What matters most is that evaluation is deterministic.

No hidden mutation.
No implicit behavior.

### Guardrails

The interpreter enforces:

- Maximum loop iterations  
- Maximum recursion depth  
- Execution time caps  

Even a simple infinite loop must fail safely:

```gs
repeat {
  say "hello"
}
```

The runtime halts and reports a limit error.

Safety improves trust.

---

## Stage 4: Transpiler

The transpiler converts the AST into another language, typically JavaScript.

Why transpile?

- Performance gains  
- Integration with existing runtimes  
- Validation against interpreter semantics  
- Inspectable output  

The key rule:

> Transpiled output must match interpreter semantics exactly.

Semantic drift is dangerous.

Tests guard against it.

---

## CLI Tooling

A language without a CLI is just a library.

CLI commands provide workflow:

- `genesis run file.gs`  
- `genesis parse file.gs`  
- `genesis transpile file.gs`  
- `genesis test`  

One-command execution matters.

Printing tokens and ASTs is especially powerful. Transparency helps debugging and learning.

---

## Testing strategy

Without tests, language development becomes regression chaos.

The suite includes:

### Tokenizer tests
- Edge cases  
- String handling  
- Comment parsing  

### Parser tests
- Valid syntax  
- Invalid syntax  
- Precedence correctness  

### Interpreter tests
- Arithmetic correctness  
- Control flow  
- Scope isolation  
- Error behavior  

### Transpiler equivalence tests
Interpreter output is compared against transpiled JS output.

If they diverge, something is wrong.

Testing is not optional in language design.

---

## Security hardening in v2

Version 1 was exploratory.

Version 2 focused on safety and structural integrity.

### Resource limits

- Max source size  
- Max token count  
- Max AST node count  
- Max loop iterations  

These prevent denial-of-service behavior.

### Strict host boundaries

The runtime does not automatically access:

- Filesystem  
- Network  
- Process execution  

Capabilities must be explicitly injected.

A safe pattern:

- The interpreter has no inherent host power  
- Host capabilities are granted deliberately  

Security is about containment.

### Predictable failure

When the runtime fails, it fails:

- Early  
- Clearly  
- Consistently  

Undefined behavior is unacceptable.

---

## Lessons learned

### Toolchains are the real work

Syntax is the easy part.

Tooling, testing, and error design are the real language.

### Safety clarifies design

When you design for safety, ambiguity disappears.

You are forced to define behavior precisely.

### Simplicity scales

Beginner-friendly does not mean weak.

It means:

- Fewer hidden rules  
- Smaller surface area  
- Clear mental model  

Complexity is easy.
Clarity is harder.

---

## How this connects to my broader work

Genesis Script aligns with the same philosophy behind my other projects:

- Offline-first systems  
- Deterministic environments  
- Explicit boundaries  
- Calm software  

Desktop4Kids OS is a platform.

Genesis Script is a language.

Both are built around:

- Predictability  
- Safety  
- Intentional architecture  

The domain changes.
The principles do not.

---

## Future directions

If I expand Genesis Script further:

- Module system (import/export)  
- Expanded standard library  
- REPL improvements  
- Optional lightweight type hints  
- Configurable sandbox profiles  

The goal is not scale.

It is structural integrity.

---

## Closing thoughts

Building a programming language is one of the fastest ways to grow as an engineer.

It forces you to think in pipelines.
It forces you to define behavior.
It forces you to test.

Genesis Script v2 is proof that an experiment can evolve into an engineered system — with boundaries, tooling, and safeguards.

Not flashy.

Structured.

And built to last.