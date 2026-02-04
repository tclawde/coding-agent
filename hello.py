def greet(name):
    print(f'Hello, {name}!')


def calculate_fibonacci(n):
    if n <= 0:
        return 0
    if n == 1:
        return 1
    
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b


if __name__ == '__main__':
    greet('World')
    result = calculate_fibonacci(10)
    print(f'Fibonacci(10) = {result}')
