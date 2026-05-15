require('dotenv').config();

const {
  Client,
  GatewayIntentBits,
  PermissionsBitField,
  ChannelType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder
} = require('discord.js');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {

  if (message.author.bot) return;

  if (message.content === '!panel') {

  const embed = new EmbedBuilder()
  .setTitle('🎟️ M$NF Tickets')
  .setDescription(
    '```fix\nSistema automático de soporte y pagos\n```\n\n✨ Soporte rápido\n💳 Pagos automáticos\n🚀 Entrega instantánea'
  )
  .setColor('#9333ea')
  .setImage('https://i.pinimg.com/originals/1c/ab/8c/1cab8c9ffdfd79b616872e05f333fc54.gif')
  .setThumbnail('https://i.pinimg.com/736x/d4/1b/6e/d41b6eb12b853a4623dae7c488317559.jpg')
  .setFooter({
    text: 'M$NF STORE'
  })
  .setTimestamp();

const row = new ActionRowBuilder()
.addComponents(
  new ButtonBuilder()
    .setCustomId('create_ticket')
    .setLabel('Open Ticket')
    .setEmoji('🎫')
    .setStyle(ButtonStyle.Success),

  new ButtonBuilder()
    .setLabel('Discord')
    .setStyle(ButtonStyle.Link)
    .setURL('https://discord.gg/VhTzHCGNZH')
    .setEmoji('🌐')
);

    await message.channel.send({
      embeds: [embed],
      components: [row]
    });
  }
});

client.on('interactionCreate', async (interaction) => {

  if (!interaction.isButton()) return;

  if (interaction.customId === 'create_ticket') {

    const channel = await interaction.guild.channels.create({
      name: `ticket-${interaction.user.username}`,
      type: ChannelType.GuildText,
      permissionOverwrites: [
        {
          id: interaction.guild.id,
          deny: [PermissionsBitField.Flags.ViewChannel]
        },
        {
          id: interaction.user.id,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages
          ]
        }
      ]
    });

   const paymentButtons = new ActionRowBuilder()
  .addComponents(

    new ButtonBuilder()
      .setCustomId('paypal')
      .setLabel('PayPal')
      .setEmoji('💳')
      .setStyle(ButtonStyle.Primary),

    new ButtonBuilder()
      .setCustomId('binance')
      .setLabel('Binance')
      .setEmoji('🟡')
      .setStyle(ButtonStyle.Success),

    new ButtonBuilder()
      .setCustomId('cashapp')
      .setLabel('Cash App')
      .setEmoji('💵')
      .setStyle(ButtonStyle.Secondary),

    new ButtonBuilder()
      .setCustomId('close_ticket')
      .setLabel('Close Ticket')
      .setEmoji('🔒')
      .setStyle(ButtonStyle.Danger)
  );

const ticketEmbed = new EmbedBuilder()
.setTitle('🎟️ Ticket Creado')
.setDescription(
`Bienvenido ${interaction.user}

💳 Selecciona un método de pago abajo.`
)
.setColor('#7e22ce')
.setImage('https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif')
.setFooter({
  text: 'Exotic Support System'
});

await channel.send({
  embeds: [ticketEmbed],
  components: [paymentButtons]
});

    await interaction.reply({
      content: `Ticket created: ${channel}`,
      ephemeral: true
    });
  }

  if (interaction.customId === 'paypal') {

    await interaction.reply({
      content: `Pay here: ${process.env.PAYPAL_LINK}`,
      ephemeral: true
    });
  }

  if (interaction.customId === 'binance') {

    await interaction.reply({
      content: `Pay here: ${process.env.BINANCE_LINK}`,
      ephemeral: true
    });
  }

  if (interaction.customId === 'cashapp') {
if (interaction.customId === 'close_ticket') {

  await interaction.reply({
    content: '🔒 Cerrando ticket...',
    ephemeral: true
  });

  setTimeout(() => {
    interaction.channel.delete();
  }, 3000);
}
new ButtonBuilder()
  .setCustomId('close_ticket')
  .setLabel('Close Ticket')
  .setEmoji('🔒')
  .setStyle(ButtonStyle.Danger)

    await interaction.reply({
      content: `Send payment to ${process.env.CASHAPP_TAG} and upload proof.`,
      ephemeral: true
    });
  }
});

app.listen(process.env.PORT, () => {
  console.log('Webhook server online');
});

client.login(process.env.TOKEN);