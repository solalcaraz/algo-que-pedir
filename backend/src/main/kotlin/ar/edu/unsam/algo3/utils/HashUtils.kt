package ar.edu.unsam.algo3.utils

object HashUtils {
    /**
     * Función de hashing que devuelve un string hexadecimal a partir de un string
     * Genera un hash de 53 bits representado en hexadecimal
     * Fuente: https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript/52171480#52171480
     */
    fun hash53(str: String, seed: Int = 0): String {
        var h1 = (0xdeadbeef.toInt() xor seed)
        var h2 = (0x41c6ce57.toInt() xor seed)

        for (i in str.indices) {
            val ch = str[i].code
            h1 = (h1 xor ch) * 2654435761.toInt()
            h2 = (h2 xor ch) * 1597334677
        }

        h1 = (h1 xor (h1 ushr 16)) * 2246822507.toInt()
        h1 = h1 xor ((h2 xor (h2 ushr 13)) * 3266489909.toInt())
        h2 = (h2 xor (h2 ushr 16)) * 2246822507.toInt()
        h2 = h2 xor ((h1 xor (h1 ushr 13)) * 3266489909.toInt())

        return (4294967296L * (2097151L and h2.toLong()) + (h1.toLong() and 0xFFFFFFFFL)).toString(16)
    }
}