use anchor_lang::prelude::*;

declare_id!("2YVujTjqyFigZx4YYh1fFzWgPtd2bDwgUJNEjiDLVCcC");

#[program]
pub mod wall_contract {
    use super::*;

    pub fn createpost(
        ctx: Context<Createpost>,
        message: String, 
        author: Option<String>,
        hash_tag: Option<String>
    ) -> Result<()> {
        let post = &mut ctx.accounts.post;
        post.author = author;
        post.message = message;
        post.hash_tag = hash_tag;
        Ok(())
    }
}


#[derive(Accounts)]
pub struct Createpost<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(init, payer=signer, space=64)]
    pub post: Account<'info, Post>,

    pub system_program: Program<'info, System>,
}


#[account]
pub struct Post {
    pub message: String,
    pub hash_tag: Option<String>,
    pub author: Option<String>,
}

