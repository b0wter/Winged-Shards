export abstract class ParticleHelpers
{
    public static explosionRegular(scene: Phaser.Scene, x: number, y: number, scale: number = 1.0, texture: string = 'particle_red_mini')
    {
        this.explosionRegularWith(scene, x, y, scale, texture, 350, 150);
    }

    public static explosionRegularWith(scene: Phaser.Scene, x: number, y: number, scale: number, texture: string, lifespan: number, speed: number)
    {
        const particles = scene.add.particles(
            x,
            y,
            texture,
            {
                speed: speed,
                lifespan: lifespan,
                active: true,
                scale: scale,
                stopAfter: 40,
                frequency: 20,
                quantity: 5,
                alpha: {
                    onUpdate: (p, k, t, v) => Math.sqrt(1 - t)
                }
            });
        setTimeout(() => particles.destroy(), lifespan * 2.0)
    }

    public static explosionBigWith(scene: Phaser.Scene, x: number, y: number, scale: number, texture: string, lifespan: number, speed: number)
    {
        const particles = scene.add.particles(
            x,
            y,
            texture,
            {
                speed: speed,
                lifespan: lifespan,
                active: true,
                scale: scale,
                stopAfter: 40,
                frequency: 30,
                quantity: 5,
                alpha: {
                    onUpdate: (p, k, t, v) => Math.sqrt(1 - t)
                }
            });
        setTimeout(() => particles.destroy(), lifespan * 2.0)
    }
}
