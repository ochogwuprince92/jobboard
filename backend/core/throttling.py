from rest_framework.throttling import UserRateThrottle

class AnonRateThrottle(UserRateThrottle):
    scope = 'anon'

class UserLoginRateThrottle(UserRateThrottle):
    scope = 'login'
