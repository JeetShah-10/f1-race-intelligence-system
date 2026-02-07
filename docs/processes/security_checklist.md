# Security Checklist — F1 Race Intelligence System

## Phase 1 (MVP)

- [ ] Input validation on all endpoints
- [ ] No secrets in codebase
- [ ] Environment variables for config
- [ ] CORS configured correctly
- [ ] Rate limiting on simulation endpoints

## Phase 2 (Auth)

- [ ] Password hashing (bcrypt)
- [ ] JWT token auth
- [ ] HTTPS only
- [ ] Secure session management
- [ ] SQL injection prevention

## Never Commit

- API keys
- Database credentials
- AWS/GCP tokens
- `.env` files

## Validation

All user input validated via Pydantic:

```python
class SimulationRequest(BaseModel):
    circuit: str = Field(..., min_length=1, max_length=50)
    year: int = Field(..., ge=2018, le=2026)
```