def factorial(n):
    if n == 0:
        return 1
    else:
        return n * factorial(n-1)

def mergeSort(n:list):
    if len(n) > 1:
        mid = len(n)//2
        left = n[:mid]
        right = n[mid:]
        mergeSort(left)
        mergeSort(right)
        i = j = k = 0
        while i < len(left) and j < len(right):
            if left[i] < right[j]:
                n[k] = left[i]
                i += 1
            else:
                n[k] = right[j]
                j += 1
            k += 1
        while i < len(left):
            n[k] = left[i]
            i += 1
            k += 1
        while j < len(right):
            n[k] = right[j]
            j += 1
            k += 1
    return n

def i